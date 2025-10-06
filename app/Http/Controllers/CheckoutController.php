<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Mail\OrderConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page
     */
    public function index(Request $request)
    {
        // Get cart items (from DB if logged in, from session if guest)
        if (auth()->check()) {
            $cartItems = Cart::with('product')
                ->where('user_id', auth()->id())
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product' => $item->product,
                        'quantity' => $item->quantity,
                        'size' => $item->size,
                    ];
                });
        } else {
            $sessionCart = session('cart', []);
            $cartItems = collect($sessionCart)->map(function ($item) {
                $product = \App\Models\Product::find($item['product_id']);
                return [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'size' => $item['size'] ?? null,
                ];
            })->filter(fn($item) => $item['product'] !== null)->values();
        }

        // Redirect if cart is empty
        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'razorpayKey' => config('services.razorpay.key'),
        ]);
    }

    /**
     * Process the checkout and create order
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'country' => 'required|string|max:100',
            'password' => 'nullable|string|min:8',
            'razorpay_payment_id' => 'required|string',
            'razorpay_order_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        // Verify Razorpay signature
        $signature = hash_hmac('sha256', 
            $validated['razorpay_order_id'] . '|' . $validated['razorpay_payment_id'], 
            config('services.razorpay.secret')
        );

        if ($signature !== $validated['razorpay_signature']) {
            return back()->withErrors(['payment' => 'Payment verification failed. Please try again.']);
        }

        DB::beginTransaction();

        try {
            // Handle user creation/login for guests
            $user = auth()->user();
            
            if (!$user) {
                // Check if user exists with this email
                $user = User::where('email', $validated['email'])->first();
                
                if ($user) {
                    // User exists, log them in
                    auth()->login($user);
                } else {
                    // Create new user
                    if (!$validated['password']) {
                        return back()->withErrors(['password' => 'Password is required for new accounts']);
                    }
                    
                    $user = User::create([
                        'name' => $validated['name'],
                        'email' => $validated['email'],
                        'password' => Hash::make($validated['password']),
                        'phone' => $validated['phone'],
                        'address' => $validated['address'],
                        'city' => $validated['city'],
                        'state' => $validated['state'],
                        'pincode' => $validated['pincode'],
                        'country' => $validated['country'],
                    ]);
                    
                    auth()->login($user);
                }
            }

            // Update user address if it's their first order or they changed it
            // Always update to ensure data is saved
            \Log::info('Updating user address', [
                'user_id' => $user->id,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'pincode' => $validated['pincode'],
                'country' => $validated['country'],
            ]);
            
            $user->update([
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'city' => $validated['city'],
                'state' => $validated['state'],
                'pincode' => $validated['pincode'],
                'country' => $validated['country'],
            ]);
            
            \Log::info('User updated successfully', ['user_id' => $user->id]);

            // Get cart items
            if (auth()->check()) {
                $cartItems = Cart::with('product')->where('user_id', $user->id)->get();
            } else {
                // This shouldn't happen now, but keep as fallback
                $sessionCart = session('cart', []);
                $cartItems = collect($sessionCart)->map(function ($item) {
                    return (object)[
                        'product' => \App\Models\Product::find($item['product_id']),
                        'quantity' => $item['quantity'],
                        'size' => $item['size'] ?? null,
                    ];
                })->filter(fn($item) => $item->product !== null);
            }

            if ($cartItems->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Calculate total
            $total = $cartItems->sum(function ($item) {
                $price = $item->product->sale_price ?? $item->product->price;
                return $price * $item->quantity;
            });

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount' => $total,
                'status' => 'pending',
                'shipping_address' => $validated['address'],
                'shipping_city' => $validated['city'],
                'shipping_state' => $validated['state'],
                'shipping_pincode' => $validated['pincode'],
                'phone' => $validated['phone'],
                'notes' => 'Payment ID: ' . $validated['razorpay_payment_id'],
            ]);

            // Create order items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product->id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price' => $item->product->sale_price ?? $item->product->price,
                    'size' => $item->size ?? null,
                ]);
            }

            // Clear cart
            Cart::where('user_id', $user->id)->delete();
            session()->forget('cart');

            DB::commit();

            // Send order confirmation email
            try {
                Mail::to($user->email)->send(new OrderConfirmation($order));
            } catch (\Exception $e) {
                // Log email error but don't fail the order
                \Log::error('Failed to send order confirmation email: ' . $e->getMessage());
            }

            // Redirect to homepage with success message
            return redirect()->route('home')
                ->with('success', 'Order placed successfully! Check your email for order confirmation.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to process order: ' . $e->getMessage()]);
        }
    }

    /**
     * Create Razorpay order
     */
    public function createRazorpayOrder(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        try {
            $api = new \Razorpay\Api\Api(
                config('services.razorpay.key'),
                config('services.razorpay.secret')
            );

            $orderData = [
                'receipt' => 'order_' . time(),
                'amount' => $request->amount * 100, // Amount in paise
                'currency' => 'INR',
                'payment_capture' => 1
            ];

            $razorpayOrder = $api->order->create($orderData);

            return response()->json([
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show order success page
     */
    public function success($orderId)
    {
        $order = Order::with(['orderItems.product', 'user'])->findOrFail($orderId);

        // Make sure the order belongs to the current user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }
}
