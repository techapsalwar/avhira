<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MainCategory;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    // Main Categories Management
    public function indexMain(Request $request)
    {
        $query = MainCategory::withCount('subcategories');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        $mainCategories = $query->ordered()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Categories/MainIndex', [
            'mainCategories' => $mainCategories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function createMain()
    {
        return Inertia::render('Admin/Categories/CreateMain');
    }

    public function storeMain(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:main_categories,name',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['is_active'] = $request->get('is_active', true);

        MainCategory::create($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Main category created successfully.');
    }

    public function editMain(MainCategory $mainCategory)
    {
        return Inertia::render('Admin/Categories/EditMain', [
            'mainCategory' => $mainCategory,
        ]);
    }

    public function updateMain(Request $request, MainCategory $mainCategory)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:main_categories,name,' . $mainCategory->id,
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        
        if ($request->name !== $mainCategory->name) {
            $data['slug'] = Str::slug($request->name);
        }

        $mainCategory->update($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Main category updated successfully.');
    }

    public function destroyMain(MainCategory $mainCategory)
    {
        // Check if main category has subcategories
        if ($mainCategory->subcategories()->count() > 0) {
            return redirect()->route('admin.categories.index')
                ->with('error', 'Cannot delete main category with subcategories.');
        }

        $mainCategory->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Main category deleted successfully.');
    }

    // Subcategories Management
    public function index(Request $request)
    {
        $query = Subcategory::with('mainCategory')->withCount('products');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('main_category')) {
            $query->where('main_category_id', $request->main_category);
        }

        $subcategories = $query->ordered()->paginate(15)->withQueryString();
        $mainCategories = MainCategory::withCount('subcategories')->active()->ordered()->get();

        return Inertia::render('Admin/Categories/Index', [
            'subcategories' => $subcategories,
            'mainCategories' => $mainCategories,
            'filters' => $request->only(['search', 'main_category']),
        ]);
    }

    public function create()
    {
        $mainCategories = MainCategory::active()->ordered()->get();

        return Inertia::render('Admin/Categories/Create', [
            'mainCategories' => $mainCategories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'main_category_id' => 'required|exists:main_categories,id',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        $data['slug'] = Str::slug($request->name);
        $data['is_active'] = $request->get('is_active', true);

        // Validate unique name within main category
        $exists = Subcategory::where('main_category_id', $request->main_category_id)
            ->where('name', $request->name)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'This subcategory name already exists in the selected main category.']);
        }

        Subcategory::create($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Subcategory created successfully.');
    }

    public function edit(Subcategory $subcategory)
    {
        $subcategory->load('mainCategory');
        $mainCategories = MainCategory::active()->ordered()->get();

        return Inertia::render('Admin/Categories/Edit', [
            'subcategory' => $subcategory,
            'mainCategories' => $mainCategories,
        ]);
    }

    public function update(Request $request, Subcategory $subcategory)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'main_category_id' => 'required|exists:main_categories,id',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $data = $request->all();
        
        // Validate unique name within main category (excluding current)
        $exists = Subcategory::where('main_category_id', $request->main_category_id)
            ->where('name', $request->name)
            ->where('id', '!=', $subcategory->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'This subcategory name already exists in the selected main category.']);
        }
        
        if ($request->name !== $subcategory->name) {
            $data['slug'] = Str::slug($request->name);
        }

        $subcategory->update($data);

        return redirect()->route('admin.categories.index')
            ->with('success', 'Subcategory updated successfully.');
    }

    public function destroy(Subcategory $subcategory)
    {
        // Check if subcategory has products
        if ($subcategory->products()->count() > 0) {
            return redirect()->route('admin.categories.index')
                ->with('error', 'Cannot delete subcategory with existing products.');
        }

        $subcategory->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Subcategory deleted successfully.');
    }
}
