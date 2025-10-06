<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index()
    {
        $categories = Category::withCount('products')->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display the specified category with its products.
     */
    public function show(Category $category)
    {
        $category->load('products');

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'products' => $category->products,
        ]);
    }
}
