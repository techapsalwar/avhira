<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\MainCategory;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    /**
     * Display the welcome page.
     */
    public function index()
    {
        $featuredProducts = Product::with('subcategory.mainCategory')
            ->where('is_featured', true)
            ->latest()
            ->take(8)
            ->get();

        $mainCategories = MainCategory::with('activeSubcategories')
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('Welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $mainCategories, // Keeping same key for backward compatibility
        ]);
    }
}
