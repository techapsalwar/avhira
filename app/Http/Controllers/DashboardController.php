<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        // Active order: not delivered/cancelled
        $activeOrder = Order::where('user_id', $user->id)
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->with(['orderItems.product'])
            ->latest('created_at')
            ->first();

        // Delivered orders
        $deliveredOrders = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->with(['orderItems.product'])
            ->orderByDesc('created_at')
            ->get();

        // Cancelled orders
        $cancelledOrders = Order::where('user_id', $user->id)
            ->where('status', 'cancelled')
            ->with(['orderItems.product'])
            ->orderByDesc('updated_at')
            ->get();

        // Ensure relationships are loaded and accessible
        if ($activeOrder) {
            $activeOrder->load(['orderItems.product']);
            $activeOrder->append('items');
        }

        return Inertia::render('Dashboard', [
            'user' => $user,
            'activeOrder' => $activeOrder ? [
                'id' => $activeOrder->id,
                'order_number' => $activeOrder->order_number,
                'total_amount' => $activeOrder->total_amount,
                'status' => $activeOrder->status,
                'payment_method' => $activeOrder->payment_method,
                'shipping_address' => $activeOrder->shipping_address,
                'created_at' => $activeOrder->created_at,
                'updated_at' => $activeOrder->updated_at,
                'order_items' => $activeOrder->orderItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'size' => $item->size,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'description' => $item->product->description,
                            'images' => $item->product->images,
                        ] : null,
                    ];
                }),
            ] : null,
            'deliveredOrders' => $deliveredOrders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'shipping_address' => $order->shipping_address,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'size' => $item->size,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'description' => $item->product->description,
                                'images' => $item->product->images,
                            ] : null,
                        ];
                    }),
                ];
            }),
            'cancelledOrders' => $cancelledOrders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'shipping_address' => $order->shipping_address,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product_name,
                            'size' => $item->size,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'description' => $item->product->description,
                                'images' => $item->product->images,
                            ] : null,
                        ];
                    }),
                ];
            }),
        ]);
    }
}
