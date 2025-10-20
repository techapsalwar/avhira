<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\MainCategory;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $products = Product::with('subcategory.mainCategory')->latest()->get();
        $mainCategories = MainCategory::with('activeSubcategories')
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $mainCategories,
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load('subcategory.mainCategory');
        
        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
