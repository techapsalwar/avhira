<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\MainCategory;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('subcategory.mainCategory');

        // Search functionality
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
            });
        }

        // Subcategory filter
        if ($request->filled('subcategory')) {
            $query->where('subcategory_id', $request->subcategory);
        }

        // Main category filter
        if ($request->filled('main_category')) {
            $query->whereHas('subcategory', function($q) use ($request) {
                $q->where('main_category_id', $request->main_category);
            });
        }

        // Stock filter
        if ($request->filled('stock')) {
            if ($request->stock === 'low') {
                $query->where('stock_quantity', '<', 10);
            } elseif ($request->stock === 'out') {
                $query->where('stock_quantity', '=', 0);
            } elseif ($request->stock === 'in') {
                $query->where('stock_quantity', '>', 0);
            }
        }

        // Featured filter
        if ($request->filled('featured')) {
            $query->where('is_featured', $request->featured === 'yes');
        }

        $products = $query->latest()->paginate(15)->withQueryString();
        
        $mainCategories = MainCategory::with('activeSubcategories')
            ->active()
            ->ordered()
            ->get();
        
        $subcategories = Subcategory::active()->ordered()->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'mainCategories' => $mainCategories,
            'subcategories' => $subcategories,
            'filters' => $request->only(['search', 'subcategory', 'main_category', 'stock', 'featured']),
        ]);
    }

    public function create()
    {
        $mainCategories = MainCategory::with('activeSubcategories')
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('Admin/Products/Create', [
            'mainCategories' => $mainCategories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subcategory_id' => 'required|exists:subcategories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|unique:products,sku',
            'is_featured' => 'boolean',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'video_url' => 'nullable|url',
            'available_sizes' => 'required|array|min:1',
            'available_sizes.*' => 'string',
        ]);

        $data = $request->only([
            'name', 'subcategory_id', 'description', 'price', 'sale_price',
            'stock_quantity', 'sku', 'video_url'
        ]);
        
        // Generate unique slug
        $baseSlug = Str::slug($request->name);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        $data['slug'] = $slug;
        $data['is_featured'] = $request->boolean('is_featured');

        // Handle image uploads
        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = $path;
            }
            $data['images'] = $imagePaths; // Model will auto-cast to JSON
        }

        // Handle available sizes - Model will auto-cast to JSON
        $data['available_sizes'] = $request->available_sizes;

        Product::create($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function show($id)
    {
        $product = Product::with('subcategory.mainCategory')->findOrFail($id);
        
        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit($id)
    {
        $product = Product::with('subcategory.mainCategory')->findOrFail($id);
        
        $mainCategories = MainCategory::with('activeSubcategories')
            ->active()
            ->ordered()
            ->get();
        
        // Parse JSON fields for editing
        $product->images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
        $product->available_sizes = is_string($product->available_sizes) ? json_decode($product->available_sizes, true) : $product->available_sizes;
        
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'mainCategories' => $mainCategories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'subcategory_id' => 'required|exists:subcategories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|unique:products,sku,' . $product->id,
            'is_featured' => 'boolean',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'existing_images' => 'nullable|array',
            'video_url' => 'nullable|url',
            'available_sizes' => 'required|array|min:1',
            'available_sizes.*' => 'string',
        ]);

        $data = $request->only([
            'name', 'subcategory_id', 'description', 'price', 'sale_price',
            'stock_quantity', 'sku', 'video_url'
        ]);
        
        // Update slug if name changed
        if ($request->name !== $product->name) {
            $baseSlug = Str::slug($request->name);
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }
        
        $data['is_featured'] = $request->boolean('is_featured');

        // Handle images
        $imagePaths = $request->existing_images ?? [];
        
        // Add new images
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = $path;
            }
        }
        
        $data['images'] = $imagePaths; // Model will auto-cast to JSON
        $data['available_sizes'] = $request->available_sizes; // Model will auto-cast to JSON

        $product->update($data);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Delete images
        $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
        if (is_array($images)) {
            foreach ($images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
