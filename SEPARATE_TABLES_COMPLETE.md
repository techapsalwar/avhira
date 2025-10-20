# Separate Tables Architecture - Complete ✅

## Migration Complete!

**Date:** October 20, 2025
**Status:** ✅ Successfully Implemented

## What Changed

### Old Structure (Single Table)
```
categories
├── id
├── name
├── slug
├── parent_id (self-referencing)
├── ...
```

### New Structure (Separate Tables)

#### Table 1: `main_categories`
```sql
CREATE TABLE main_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    image VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Table 2: `subcategories`
```sql
CREATE TABLE subcategories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    main_category_id BIGINT FOREIGN KEY REFERENCES main_categories(id) ON DELETE CASCADE,
    name VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    image VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE(main_category_id, name) -- Name must be unique within each main category
);
```

#### Updated: `products` table
```sql
-- Changed from:
category_id → subcategory_id

-- Foreign key:
FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
```

---

## Benefits of Separate Tables

### ✅ Advantages

1. **Clearer Data Structure**
   - Main categories and subcategories are explicitly separate
   - No confusion about parent_id null checks
   - Better semantic meaning

2. **Better Performance**
   - No self-joins needed
   - Simpler queries
   - Better indexing strategies

3. **Easier to Scale**
   - Can add more main categories easily (Kids, Accessories, etc.)
   - Each main category table is independent
   - Can have different rules per main category

4. **Simpler Queries**
   ```php
   // Old way:
   Category::whereNull('parent_id')->get();
   
   // New way:
   MainCategory::all();
   ```

5. **Type Safety**
   - Products MUST belong to subcategories (foreign key enforced)
   - Main categories CANNOT have products directly

---

## Current Data

### Main Categories (2)
1. **Men** (ID: 1)
2. **Women** (ID: 2)

### Subcategories (13)

**Men's Subcategories (5):**
- Full Sleeve Shirts (ID: 1)
- Half Sleeve Shirts (ID: 2)
- Short Kurta (ID: 3)
- Long Kurta (ID: 4)
- Jackets (ID: 5)

**Women's Subcategories (8):**
- Short Kurtis (ID: 6)
- Sleeve Less Kurti (ID: 7)
- Full Sleeve Kurti (ID: 8)
- Peplum Top (ID: 9)
- Dress (ID: 10)
- Bell Sleeves Kurti (ID: 11)
- Dori Tops (ID: 12)
- Sarees (ID: 13)

### Products (11)
All products successfully migrated to appropriate subcategories.

---

## New Models

### 1. MainCategory Model

**File:** `app/Models/MainCategory.php`

```php
use App\Models\MainCategory;

// Get all main categories
$mainCategories = MainCategory::all();

// Get with subcategories
$men = MainCategory::with('subcategories')->where('slug', 'men')->first();

// Get all products for a main category
$menProducts = $men->getAllProducts();

// Get only active subcategories
$activeSubcategories = $men->activeSubcategories;
```

**Methods:**
- `subcategories()` - Get all subcategories
- `activeSubcategories()` - Get active subcategories only
- `getAllProducts()` - Get all products across subcategories
- `getTotalProductsCount()` - Count products
- `scopeActive()` - Filter active main categories
- `scopeOrdered()` - Order by display_order

---

### 2. Subcategory Model

**File:** `app/Models/Subcategory.php`

```php
use App\Models\Subcategory;

// Get subcategory with main category
$jackets = Subcategory::with('mainCategory')->where('slug', 'jackets')->first();

// Get products in subcategory
$products = $jackets->products;

// Get full path
echo $jackets->getFullPath(); // "Men → Jackets"

// Get subcategories for specific main category
$menSubcategories = Subcategory::forMainCategory(1)->get();
```

**Methods:**
- `mainCategory()` - Get parent main category
- `products()` - Get all products
- `activeProducts()` - Get featured products
- `getFullPath()` - Get "MainCategory → Subcategory"
- `scopeActive()` - Filter active subcategories
- `scopeOrdered()` - Order by display_order
- `scopeForMainCategory()` - Filter by main category

---

### 3. Updated Product Model

**File:** `app/Models/Product.php`

```php
use App\Models\Product;

// Get product with subcategory and main category
$product = Product::with('subcategory.mainCategory')->find(1);

// Access subcategory
echo $product->subcategory->name; // "Jackets"

// Access main category
echo $product->mainCategory->name; // "Men"

// Backward compatibility (uses subcategory())
echo $product->category->name; // Still works!
```

**New Relationships:**
- `subcategory()` - Get the subcategory
- `mainCategory()` - Get main category through subcategory
- `category()` - Alias for backward compatibility (deprecated)

---

## Usage Examples

### Example 1: Display Navigation

```php
$mainCategories = MainCategory::active()
    ->ordered()
    ->with('activeSubcategories')
    ->get();

foreach ($mainCategories as $main) {
    echo "<h2>{$main->name}</h2>";
    echo "<ul>";
    foreach ($main->activeSubcategories as $sub) {
        echo "<li><a href='/products/{$sub->slug}'>{$sub->name}</a></li>";
    }
    echo "</ul>";
}
```

Output:
```html
<h2>Men</h2>
<ul>
    <li><a href="/products/full-sleeve-shirts">Full Sleeve Shirts</a></li>
    <li><a href="/products/half-sleeve-shirts">Half Sleeve Shirts</a></li>
    ...
</ul>
```

---

### Example 2: Add Product to Subcategory

```php
use App\Models\Subcategory;
use App\Models\Product;

// Find subcategory
$jackets = Subcategory::where('slug', 'jackets')->first();

// Create product
$product = Product::create([
    'name' => 'Bomber Jacket',
    'slug' => 'bomber-jacket',
    'subcategory_id' => $jackets->id,
    'description' => 'Stylish bomber jacket',
    'price' => 3999.00,
    'stock_quantity' => 20,
    'available_sizes' => json_encode(['M', 'L', 'XL']),
    'product_type' => 'clothing',
]);

// Verify
echo $product->subcategory->name; // "Jackets"
echo $product->mainCategory->name; // "Men"
```

---

### Example 3: Add New Main Category

```php
use App\Models\MainCategory;
use App\Models\Subcategory;

// Add Kids category
$kids = MainCategory::create([
    'name' => 'Kids',
    'slug' => 'kids',
    'description' => 'Clothing for children',
    'display_order' => 3,
    'is_active' => true,
]);

// Add subcategories for Kids
$subcategories = [
    'Boys T-Shirts',
    'Girls Dresses',
    'Kids Jackets',
];

foreach ($subcategories as $index => $name) {
    Subcategory::create([
        'main_category_id' => $kids->id,
        'name' => $name,
        'display_order' => $index + 1,
        'is_active' => true,
    ]);
}
```

---

### Example 4: Get All Men's Products

```php
$men = MainCategory::where('slug', 'men')->first();

// Method 1: Using model method
$products = $men->getAllProducts();

// Method 2: Using query
$products = Product::whereHas('subcategory', function($query) use ($men) {
    $query->where('main_category_id', $men->id);
})->get();

// Method 3: Using join
$products = Product::join('subcategories', 'products.subcategory_id', '=', 'subcategories.id')
    ->where('subcategories.main_category_id', $men->id)
    ->select('products.*')
    ->get();
```

---

### Example 5: Filter Products by Category

```php
// Get all products in a specific subcategory
$jacketsProducts = Subcategory::where('slug', 'jackets')->first()->products;

// Get products with category information
$products = Product::with('subcategory.mainCategory')
    ->get()
    ->map(function($product) {
        return [
            'name' => $product->name,
            'category_path' => $product->subcategory->getFullPath(),
            'price' => $product->price,
        ];
    });
```

---

## API Endpoints (Recommended)

### Get All Main Categories with Subcategories
```
GET /api/categories

Response:
[
    {
        "id": 1,
        "name": "Men",
        "slug": "men",
        "subcategories": [
            {"id": 1, "name": "Full Sleeve Shirts", "slug": "full-sleeve-shirts"},
            {"id": 2, "name": "Half Sleeve Shirts", "slug": "half-sleeve-shirts"},
            ...
        ]
    },
    {
        "id": 2,
        "name": "Women",
        "slug": "women",
        "subcategories": [...]
    }
]
```

### Get Subcategories for Main Category
```
GET /api/main-categories/{id}/subcategories

Response:
[
    {"id": 1, "name": "Full Sleeve Shirts", "slug": "full-sleeve-shirts", "products_count": 4},
    {"id": 2, "name": "Half Sleeve Shirts", "slug": "half-sleeve-shirts", "products_count": 0},
    ...
]
```

### Get Products in Subcategory
```
GET /api/subcategories/{slug}/products

Response:
{
    "subcategory": {
        "id": 5,
        "name": "Jackets",
        "main_category": "Men"
    },
    "products": [...]
}
```

---

## Database Queries

### Raw SQL Examples

```sql
-- Get all main categories with subcategory count
SELECT 
    m.id,
    m.name,
    COUNT(s.id) as subcategory_count
FROM main_categories m
LEFT JOIN subcategories s ON m.id = s.main_category_id
GROUP BY m.id, m.name;

-- Get all products with full category path
SELECT 
    p.id,
    p.name AS product_name,
    s.name AS subcategory,
    m.name AS main_category,
    CONCAT(m.name, ' → ', s.name) AS full_path
FROM products p
JOIN subcategories s ON p.subcategory_id = s.id
JOIN main_categories m ON s.main_category_id = m.id;

-- Get product count per main category
SELECT 
    m.name AS main_category,
    COUNT(p.id) AS product_count
FROM main_categories m
JOIN subcategories s ON m.id = s.main_category_id
LEFT JOIN products p ON s.id = p.subcategory_id
GROUP BY m.id, m.name;
```

---

## Migration Files

1. ✅ `2025_10_20_103558_create_main_categories_and_subcategories_tables.php`
   - Drops old `categories` table
   - Creates `main_categories` table
   - Creates `subcategories` table
   - Updates `products` table (category_id → subcategory_id)
   - Migrates existing data

2. ✅ `database/seeders/SeparateTablesSeeder.php`
   - Seeds main categories (Men, Women)
   - Seeds all subcategories

3. ✅ `database/seeders/MigrateProductsToSubcategoriesSeeder.php`
   - Migrates products to new subcategory IDs
   - Uses intelligent name matching

---

## Rollback Plan

If you need to revert to the old structure:

```bash
php artisan migrate:rollback --step=1
```

The migration includes a complete `down()` method that:
- Backs up data from new tables
- Recreates old `categories` table with parent_id
- Restores all data
- Updates products table back to category_id

---

## Quick Reference Commands

```bash
# View main categories
php artisan tinker --execute="MainCategory::all()->pluck('name')"

# View subcategories for Men
php artisan tinker --execute="Subcategory::where('main_category_id', 1)->pluck('name')"

# Count products in Jackets
php artisan tinker --execute="Subcategory::find(5)->products()->count()"

# Get product with full category path
php artisan tinker --execute="\$p = Product::find(1); echo \$p->subcategory->getFullPath();"
```

---

## Notes

✅ **Completed:**
- Old `categories` table deleted
- New `main_categories` and `subcategories` tables created
- All 11 products migrated successfully
- 2 main categories + 13 subcategories seeded
- Models created and relationships defined

⚠️ **Important:**
- Products MUST have a valid `subcategory_id`
- Subcategories MUST have a valid `main_category_id`
- Cascading deletes are enabled (delete main category = delete all subcategories + products)

🎯 **Next Steps:**
- Update frontend to use new models
- Create admin panel for managing main categories and subcategories
- Update API endpoints
- Add more main categories (Kids, Accessories, etc.)

---

**Architecture Change Complete!** 🎉
