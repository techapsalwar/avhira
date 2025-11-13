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

        return Inertia::render('Dashboard', [
            'user' => $user,
            'activeOrder' => $activeOrder,
            'deliveredOrders' => $deliveredOrders,
            'cancelledOrders' => $cancelledOrders,
        ]);
    }
}
