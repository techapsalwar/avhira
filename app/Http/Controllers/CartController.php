<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CartController extends Controller
{
    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
        ]);

        $userId = Auth::id();
        $sessionId = $userId ? null : session()->getId();

        // Check if item already exists in cart
        $existingCart = Cart::where('user_id', $userId)
            ->where('session_id', $sessionId)
            ->where('product_id', $request->product_id)
            ->where('size', $request->size)
            ->first();

        if ($existingCart) {
            // If exists, increment the quantity
            $existingCart->quantity += $request->quantity;
            $existingCart->save();
            $cart = $existingCart;
        } else {
            // If doesn't exist, create new cart item
            $cart = Cart::create([
                'user_id' => $userId,
                'session_id' => $sessionId,
                'product_id' => $request->product_id,
                'size' => $request->size,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['success' => true, 'cart' => $cart]);
    }

    /**
     * Merge guest cart items into authenticated user's cart (atomic)
     */
    public function mergeGuest(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        Log::info('mergeGuest called', ['user_id' => $userId, 'payload' => $request->all()]);

        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
        ]);

        $items = $data['items'];

        DB::beginTransaction();
        try {
            foreach ($items as $it) {
                $existing = Cart::where('user_id', $userId)
                    ->where('product_id', $it['product_id'])
                    ->where('size', $it['size'] ?? null)
                    ->first();

                if ($existing) {
                    $existing->quantity += $it['quantity'];
                    $existing->save();
                } else {
                    Cart::create([
                        'user_id' => $userId,
                        'session_id' => null,
                        'product_id' => $it['product_id'],
                        'size' => $it['size'] ?? null,
                        'quantity' => $it['quantity'],
                    ]);
                }
            }

            DB::commit();
            Log::info('mergeGuest success', ['user_id' => $userId, 'merged_count' => count($items)]);
            return response()->json(['success' => true, 'merged_count' => count($items)]);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Failed to merge guest cart: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to merge guest cart'], 500);
        }
    }

    /**
     * Get cart count
     */
    public function count()
    {
        $userId = Auth::id();
        $sessionId = $userId ? null : session()->getId();

        $count = Cart::where(function ($query) use ($userId, $sessionId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->sum('quantity');

        return response()->json(['count' => $count]);
    }

    /**
     * Get cart items as JSON (for cart slider)
     */
    public function items()
    {
        $userId = Auth::id();
        $sessionId = $userId ? null : session()->getId();

        $cartItems = Cart::with('product')
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->get();

        return response()->json(['items' => $cartItems]);
    }

    /**
     * Display cart page
     */
    public function index()
    {
        $userId = Auth::id();
        $sessionId = $userId ? null : session()->getId();

        $cartItems = Cart::with('product')
            ->where(function ($query) use ($userId, $sessionId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })
            ->get();

        return inertia('Cart/Index', [
            'cartItems' => $cartItems,
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, Cart $cart)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart->update(['quantity' => $request->quantity]);

        return response()->json(['success' => true]);
    }

    /**
     * Remove item from cart
     */
    public function remove(Cart $cart)
    {
        $cart->delete();

        return response()->json(['success' => true]);
    }
}
