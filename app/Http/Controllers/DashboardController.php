<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();
        // Active order: not delivered/cancelled
        $activeOrder = Order::where('user_id', $user->id)
            ->whereNotIn('status', ['delivered', 'cancelled'])
            ->latest('created_at')
            ->first();
        // Delivered orders
        $deliveredOrders = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->orderByDesc('created_at')
            ->get();
        return Inertia::render('Dashboard', [
            'user' => $user,
            'activeOrder' => $activeOrder,
            'deliveredOrders' => $deliveredOrders,
        ]);
    }
}
