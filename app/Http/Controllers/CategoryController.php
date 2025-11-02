<?php

namespace App\Http\Controllers;

use App\Models\MainCategory;
use App\Models\Subcategory;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of main categories with subcategories.
     */
    public function index()
    {
        $mainCategories = MainCategory::with(['subcategories' => function ($query) {
            $query->withCount('products')->active()->ordered();
        }])
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $mainCategories,
        ]);
    }

    /**
     * Display the specified main category with subcategories.
     */
    public function showMain(MainCategory $mainCategory)
    {
        $mainCategory->load(['subcategories' => function ($query) {
            $query->withCount('products')->active()->ordered();
        }]);

        // Get all products from all subcategories under this main category
        $products = $mainCategory->getAllProducts();

        return Inertia::render('Categories/ShowMain', [
            'mainCategory' => $mainCategory,
            'products' => $products,
            'totalProducts' => $products->count(),
        ]);
    }

    /**
     * Display the specified subcategory with its products.
     */
    public function showSubcategory(MainCategory $mainCategory, Subcategory $subcategory)
    {
        if ($subcategory->main_category_id !== $mainCategory->id) {
            abort(404);
        }

        $subcategory->load(['products', 'mainCategory']);

        return Inertia::render('Categories/Show', [
            'category' => $subcategory,
            'mainCategory' => $subcategory->mainCategory,
            'products' => $subcategory->products,
        ]);
    }
}
