<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\MainCategory;
use App\Models\Subcategory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        // Basic stats
        $stats = [
            'total_users' => User::count(),
            'total_products' => Product::count(),
            'total_categories' => MainCategory::count() + Subcategory::count(),
            'total_main_categories' => MainCategory::count(),
            'total_subcategories' => Subcategory::count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'processing_orders' => Order::where('status', 'processing')->count(),
            'total_revenue' => Order::where('status', '!=', 'cancelled')->sum('total_amount'),
            'low_stock_products' => Product::where('stock_quantity', '<', 10)->count(),
        ];

        // Revenue analytics - last 7 days
        $revenueData = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, SUM(total_amount) as revenue')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Top selling products
        $topProducts = Product::select(
                'products.id',
                'products.name',
                'products.price',
                'products.slug',
                DB::raw('SUM(order_items.quantity) as total_sold')
            )
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('products.id', 'products.name', 'products.price', 'products.slug')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get();

        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->limit(10)
            ->get();

        // Category-wise sales (by main category)
        $categorySales = MainCategory::select('main_categories.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('subcategories', 'main_categories.id', '=', 'subcategories.main_category_id')
            ->join('products', 'subcategories.id', '=', 'products.subcategory_id')
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('main_categories.id', 'main_categories.name')
            ->orderBy('total_sold', 'desc')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'revenueData' => $revenueData,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
            'categorySales' => $categorySales,
            'maintenanceMode' => Cache::get('site_maintenance_mode', false),
        ]);
    }
}
