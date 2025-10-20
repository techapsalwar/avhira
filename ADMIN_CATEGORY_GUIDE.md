# Admin Panel - Adding New Subcategories

## Overview
The admin panel allows you to add new subcategories to existing main categories (Men/Women) from the New Product tab.

## Database Structure

Your hierarchical category system works like this:

```
Main Categories (parent_id = null)
├── Men
│   ├── Full Sleeve Shirts (parent_id = 1)
│   ├── Half Sleeve Shirts (parent_id = 1)
│   ├── Short Kurta (parent_id = 1)
│   ├── Long Kurta (parent_id = 1)
│   └── Jackets (parent_id = 1)
│
└── Women
    ├── Short Kurtis (parent_id = 2)
    ├── Sleeve Less Kurti (parent_id = 2)
    ├── Full Sleeve Kurti (parent_id = 2)
    ├── Peplum Top (parent_id = 2)
    ├── Dress (parent_id = 2)
    ├── Bell Sleeves Kurti (parent_id = 2)
    └── Dori Tops (parent_id = 2)
```

## API Endpoints (For Admin Panel Development)

### Get Main Categories
```
GET /api/categories/main
Response:
[
  {
    "id": 1,
    "name": "Men",
    "slug": "men",
    "parent_id": null,
    "is_active": true
  },
  {
    "id": 2,
    "name": "Women",
    "slug": "women",
    "parent_id": null,
    "is_active": true
  }
]
```

### Get Subcategories for Main Category
```
GET /api/categories/{mainCategoryId}/subcategories
GET /api/categories/1/subcategories (for Men)

Response:
[
  {
    "id": 3,
    "name": "Full Sleeve Shirts",
    "slug": "full-sleeve-shirts",
    "parent_id": 1,
    "display_order": 1,
    "is_active": true
  },
  ...
]
```

### Create New Subcategory
```
POST /api/categories

Request Body:
{
  "name": "New Subcategory Name",
  "parent_id": 2,  // 1 for Men, 2 for Women
  "description": "Optional description",
  "is_active": true
}

Response:
{
  "id": 15,
  "name": "New Subcategory Name",
  "slug": "new-subcategory-name",
  "parent_id": 2,
  "display_order": 8,
  "is_active": true,
  "created_at": "2025-10-20T10:30:00Z"
}
```

## Admin Panel Form Example

### Product Creation Form - Category Selection

```html
<!-- Step 1: Select Main Category -->
<div className="form-group">
  <label>Select Main Category *</label>
  <select name="main_category_id" onChange={handleMainCategoryChange}>
    <option value="">-- Select Category --</option>
    <option value="1">Men</option>
    <option value="2">Women</option>
  </select>
</div>

<!-- Step 2: Select or Create Subcategory -->
<div className="form-group">
  <label>Select or Create Subcategory *</label>
  <div className="subcategory-select">
    <select name="category_id" onChange={handleCategoryChange}>
      <option value="">-- Select Subcategory --</option>
      {subcategories.map(sub => (
        <option key={sub.id} value={sub.id}>{sub.name}</option>
      ))}
    </select>
    
    <!-- Add New Subcategory Option -->
    {showNewSubcategoryForm && (
      <div className="new-subcategory-form">
        <input 
          type="text" 
          placeholder="Enter new subcategory name"
          value={newSubcategoryName}
          onChange={(e) => setNewSubcategoryName(e.target.value)}
        />
        <button onClick={handleAddSubcategory}>+ Add New</button>
        <button onClick={() => setShowNewSubcategoryForm(false)}>Cancel</button>
      </div>
    )}
    
    <button onClick={() => setShowNewSubcategoryForm(true)}>
      + Create New Subcategory
    </button>
  </div>
</div>
```

## Code Implementation (PHP/Laravel)

### Controller Method to Add Subcategory

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Store a newly created subcategory
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
        ]);

        // Get the last subcategory order for this parent
        $lastOrder = Category::where('parent_id', $validated['parent_id'])
            ->max('display_order') ?? 0;

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'],
            'description' => $validated['description'] ?? null,
            'display_order' => $lastOrder + 1,
            'is_active' => true,
        ]);

        return response()->json($category, 201);
    }

    /**
     * Get subcategories for a main category
     */
    public function getSubcategories($parentId)
    {
        $subcategories = Category::where('parent_id', $parentId)
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($subcategories);
    }

    /**
     * Get all main categories
     */
    public function getMainCategories()
    {
        $categories = Category::mainCategories()->get();
        return response()->json($categories);
    }
}
```

### Routes

```php
// routes/api.php
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Get main categories
    Route::get('categories/main', [CategoryController::class, 'getMainCategories']);
    
    // Get subcategories for a main category
    Route::get('categories/{parentId}/subcategories', [CategoryController::class, 'getSubcategories']);
    
    // Create new subcategory
    Route::post('categories', [CategoryController::class, 'store']);
});
```

## Frontend - React Component Example

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CategorySelector() {
  const [mainCategories, setMainCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load main categories
  useEffect(() => {
    axios.get('/api/admin/categories/main')
      .then(res => setMainCategories(res.data));
  }, []);

  // Load subcategories when main category changes
  useEffect(() => {
    if (selectedMain) {
      axios.get(`/api/admin/categories/${selectedMain}/subcategories`)
        .then(res => setSubcategories(res.data));
    }
  }, [selectedMain]);

  // Add new subcategory
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await axios.post('/api/admin/categories', {
        name: newCategoryName,
        parent_id: parseInt(selectedMain),
      });

      setSubcategories([...subcategories, res.data]);
      setSelectedCategory(res.data.id);
      setNewCategoryName('');
      setShowNewForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="category-selector">
      <div className="form-group">
        <label>Main Category *</label>
        <select 
          value={selectedMain} 
          onChange={(e) => {
            setSelectedMain(e.target.value);
            setSelectedCategory('');
          }}
        >
          <option value="">Select Category</option>
          {mainCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {selectedMain && (
        <div className="form-group">
          <label>Subcategory *</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {!showNewForm ? (
            <button 
              type="button"
              onClick={() => setShowNewForm(true)}
              className="btn btn-secondary mt-2"
            >
              + Add New Subcategory
            </button>
          ) : (
            <div className="new-category-form mt-2">
              <input
                type="text"
                placeholder="New subcategory name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="form-control mb-2"
              />
              <div className="btn-group">
                <button 
                  type="button"
                  onClick={handleAddCategory}
                  className="btn btn-primary"
                >
                  Create
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowNewForm(false);
                    setNewCategoryName('');
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Database Seeding

Run this command to populate the initial categories:

```bash
php artisan db:seed --class=CategorySeeder
```

## Testing Queries

### Get all main categories with subcategories
```php
$categories = Category::mainCategories()
    ->with('activeChildren')
    ->get();
```

### Get all women's subcategories
```php
$women = Category::where('name', 'Women')->first();
$womenSubcategories = $women->activeChildren;
```

### Add a new subcategory programmatically
```php
$women = Category::where('name', 'Women')->first();
$lastOrder = $women->children()->max('display_order') ?? 0;

Category::create([
    'name' => 'Crop Top',
    'slug' => 'crop-top',
    'parent_id' => $women->id,
    'display_order' => $lastOrder + 1,
    'is_active' => true,
]);
```

## Notes

- All slugs are auto-generated from the name (use Str::slug())
- Display order determines the sorting in frontend
- is_active flag allows hiding categories without deleting
- Parent-child relationship supports unlimited nesting (though UI shows 2 levels)
- Deleting a main category cascades to delete all subcategories and products
