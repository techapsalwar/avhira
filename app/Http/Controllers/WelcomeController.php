<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page.
     */
    public function index()
    {
        $featuredProducts = Product::with('category')
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get();

        $categories = Category::all();

        return Inertia::render('Welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }
}
