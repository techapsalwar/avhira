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
        // Get all featured products with their main category
        $featuredProducts = Product::with('subcategory.mainCategory')
            ->where('is_featured', true)
            ->latest()
            ->get();

        // Separate featured products by gender (Men/Women categories)
        $forHer = $featuredProducts->filter(function ($product) {
            $categoryName = strtolower($product->subcategory->mainCategory->name ?? '');
            return str_contains($categoryName, 'women') || 
                   str_contains($categoryName, 'woman') || 
                   str_contains($categoryName, 'girl') ||
                   str_contains($categoryName, 'ladies') ||
                   str_contains($categoryName, 'female');
        })->take(5)->values();

        $forHim = $featuredProducts->filter(function ($product) {
            $categoryName = strtolower($product->subcategory->mainCategory->name ?? '');
            return str_contains($categoryName, 'men') || 
                   str_contains($categoryName, 'man') || 
                   str_contains($categoryName, 'boy') ||
                   str_contains($categoryName, 'gents') ||
                   str_contains($categoryName, 'male');
        })->take(5)->values();

        $mainCategories = MainCategory::with('activeSubcategories')
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('Welcome', [
            'featuredForHer' => $forHer,
            'featuredForHim' => $forHim,
            'categories' => $mainCategories,
        ]);
    }
}
