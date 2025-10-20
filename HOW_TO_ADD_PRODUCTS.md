# How to Add Products to Categories

## Quick Reference: Category IDs

Run this to get current category IDs:
```bash
php artisan tinker --execute="echo json_encode(\App\Models\Category::all(['id', 'name', 'slug', 'parent_id'])->toArray(), JSON_PRETTY_PRINT);"
```

**Current Structure:**
- **Men (ID: 21)**
  - Full Sleeve Shirts (ID: 23)
  - Half Sleeve Shirts (ID: 24)
  - Short Kurta (ID: 25)
  - Long Kurta (ID: 26)
  - **Jackets (ID: 27)** ← Example category
  
- **Women (ID: 22)**
  - Short Kurtis (ID: 28)
  - Sleeve Less Kurti (ID: 29)
  - Full Sleeve Kurti (ID: 30)
  - Peplum Top (ID: 31)
  - Dress (ID: 32)
  - Bell Sleeves Kurti (ID: 33)
  - Dori Tops (ID: 34)
  - Sarees (ID: 35)

---

## Method 1: Using Seeder (Recommended for Multiple Products)

### Step 1: Create a Seeder
```bash
php artisan make:seeder AddMenJacketsSeeder
```

### Step 2: Edit the Seeder
File: `database/seeders/AddMenJacketsSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class AddMenJacketsSeeder extends Seeder
{
    public function run(): void
    {
        // Get Jackets category
        $jackets = Category::where('slug', 'jackets')->first();
        
        // Add multiple jacket products
        $products = [
            [
                'name' => 'Premium Leather Jacket',
                'slug' => 'premium-leather-jacket',
                'description' => 'High quality leather jacket with premium finish',
                'price' => 4999.00,
                'sale_price' => 3999.00,
                'stock_quantity' => 25,
                'sku' => 'MEN-JKT-001',
                'images' => json_encode([
                    '/images/products/leather-jacket-1.jpg',
                    '/images/products/leather-jacket-2.jpg',
                ]),
                'available_sizes' => json_encode(['S', 'M', 'L', 'XL', 'XXL']),
                'is_featured' => true,
            ],
            [
                'name' => 'Denim Jacket',
                'slug' => 'denim-jacket-blue',
                'description' => 'Classic blue denim jacket for casual wear',
                'price' => 2999.00,
                'stock_quantity' => 30,
                'sku' => 'MEN-JKT-002',
                'images' => json_encode([
                    '/images/products/denim-jacket-1.jpg',
                ]),
                'available_sizes' => json_encode(['M', 'L', 'XL']),
                'is_featured' => false,
            ],
            [
                'name' => 'Bomber Jacket',
                'slug' => 'bomber-jacket-black',
                'description' => 'Stylish black bomber jacket',
                'price' => 3499.00,
                'stock_quantity' => 20,
                'sku' => 'MEN-JKT-003',
                'available_sizes' => json_encode(['S', 'M', 'L', 'XL']),
                'is_featured' => true,
            ],
        ];
        
        foreach ($products as $data) {
            $data['category_id'] = $jackets->id;
            $data['product_type'] = 'clothing';
            
            Product::create($data);
            
            $this->command->info("✓ Created: {$data['name']}");
        }
        
        $this->command->info("\n✓ Added " . count($products) . " jacket products");
    }
}
```

### Step 3: Run the Seeder
```bash
php artisan db:seed --class=AddMenJacketsSeeder
```

---

## Method 2: Using Tinker (Quick Single Product)

### Interactive Mode
```bash
php artisan tinker
```

Then in Tinker:
```php
// Get the category
$jackets = App\Models\Category::where('slug', 'jackets')->first();

// Create product
$product = App\Models\Product::create([
    'name' => 'Winter Puffer Jacket',
    'slug' => 'winter-puffer-jacket',
    'category_id' => $jackets->id,
    'description' => 'Warm winter puffer jacket with insulation',
    'price' => 5999.00,
    'sale_price' => null,
    'stock_quantity' => 15,
    'sku' => 'MEN-JKT-004',
    'images' => json_encode(['/images/products/puffer-jacket.jpg']),
    'available_sizes' => json_encode(['M', 'L', 'XL', 'XXL']),
    'is_featured' => false,
    'product_type' => 'clothing',
]);

// Verify
echo "Created: {$product->name} in {$product->category->name}\n";
```

---

## Method 3: Via Admin Panel (Coming Soon)

Once the admin panel is implemented (see `ADMIN_CATEGORY_GUIDE.md`), you'll be able to:

1. Navigate to Admin → Products → Add New
2. Fill in product details
3. Select category: **Men → Jackets**
4. Upload images
5. Click "Create Product"

---

## Method 4: Using API Endpoint (Coming Soon)

```bash
POST /api/admin/products
Content-Type: application/json

{
  "name": "Casual Blazer",
  "slug": "casual-blazer-navy",
  "category_id": 27,
  "description": "Navy blue casual blazer",
  "price": 6999.00,
  "stock_quantity": 10,
  "sku": "MEN-JKT-005",
  "available_sizes": ["M", "L", "XL"],
  "is_featured": true
}
```

---

## Product Schema Reference

### Required Fields
- `name` - Product name
- `slug` - URL-friendly slug (must be unique)
- `category_id` - Category ID (use subcategory, not main category)
- `description` - Product description
- `price` - Regular price (decimal)
- `stock_quantity` - Number in stock (integer)

### Optional Fields
- `sale_price` - Discounted price (decimal, nullable)
- `sku` - Stock keeping unit (string, unique, nullable)
- `images` - JSON array of image paths
- `video_url` - Product video URL
- `available_sizes` - JSON array of sizes
- `is_featured` - Boolean (default: false)
- `product_type` - String (default: 'clothing')

---

## Complete Example: Add Product to Any Category

```php
<?php
// Example: Add a Saree to Women → Sarees category

use App\Models\Category;
use App\Models\Product;

// Get category by slug
$sarees = Category::where('slug', 'sarees')->first();

// Create product
$product = Product::create([
    'name' => 'Banarasi Silk Saree',
    'slug' => 'banarasi-silk-saree-red',
    'category_id' => $sarees->id, // Women → Sarees
    'description' => 'Traditional Banarasi silk saree with golden zari work',
    'price' => 8999.00,
    'sale_price' => 7999.00,
    'stock_quantity' => 5,
    'sku' => 'WOMEN-SAR-001',
    'images' => json_encode([
        '/images/products/banarasi-saree-1.jpg',
        '/images/products/banarasi-saree-2.jpg',
        '/images/products/banarasi-saree-3.jpg',
    ]),
    'video_url' => 'https://youtube.com/watch?v=example',
    'available_sizes' => json_encode(['Free Size']), // Sarees typically one size
    'is_featured' => true,
    'product_type' => 'clothing',
]);

echo "Created: {$product->name} in {$product->category->name}\n";
```

---

## Finding Category IDs

### Method 1: By Slug
```php
$category = Category::where('slug', 'jackets')->first();
echo $category->id; // 27
```

### Method 2: By Name
```php
$category = Category::where('name', 'Jackets')->first();
echo $category->id; // 27
```

### Method 3: List All Subcategories
```php
Category::whereNotNull('parent_id')
    ->with('parent')
    ->get()
    ->each(function($cat) {
        echo "{$cat->parent->name} → {$cat->name} (ID: {$cat->id})\n";
    });
```

### Method 4: Get All Men's Subcategories
```php
$men = Category::where('slug', 'men')->first();
$menCategories = $men->children;

foreach ($menCategories as $cat) {
    echo "{$cat->name} (ID: {$cat->id})\n";
}
```

---

## Important Notes

### ✅ DO:
- Always assign products to **subcategories** (e.g., Jackets), not main categories (Men)
- Use unique slugs for each product
- Use unique SKUs if provided
- Store images as JSON array, even for single image: `["image.jpg"]`
- Store sizes as JSON array: `["S", "M", "L"]`

### ❌ DON'T:
- Don't assign products directly to Men or Women categories
- Don't forget to set `category_id`
- Don't use duplicate slugs or SKUs
- Don't set `sale_price` higher than `price`

---

## Verification

After adding a product, verify it:

```bash
# Check if product was created
php artisan tinker --execute="\$p = \App\Models\Product::where('slug', 'premium-leather-jacket')->first(); echo json_encode(['id' => \$p->id, 'name' => \$p->name, 'category' => \$p->category->name, 'parent_category' => \$p->category->parent->name], JSON_PRETTY_PRINT);"
```

Expected output:
```json
{
    "id": 13,
    "name": "Premium Leather Jacket",
    "category": "Jackets",
    "parent_category": "Men"
}
```

---

## Quick Command Reference

```bash
# Create new seeder
php artisan make:seeder AddProductsSeeder

# Run specific seeder
php artisan db:seed --class=AddProductsSeeder

# Open Tinker
php artisan tinker

# List all categories
php artisan tinker --execute="Category::all(['id', 'name', 'slug'])->each(fn(\$c) => print(\$c->id . ': ' . \$c->name . PHP_EOL));"

# Count products in category
php artisan tinker --execute="echo Category::find(27)->products()->count() . ' products in Jackets';"
```

---

## Example: Your Current Jacket Product

✅ **Successfully Created:**
- **ID:** 13
- **Name:** Premium Leather Jacket
- **Category:** Jackets (under Men)
- **Price:** ₹4,999.00
- **SKU:** MEN-JKT-001
- **Sizes:** S, M, L, XL, XXL
- **Featured:** Yes

To view:
```bash
php artisan tinker --execute="\$p = \App\Models\Product::find(13); echo 'Name: ' . \$p->name . PHP_EOL; echo 'Category: ' . \$p->category->parent->name . ' → ' . \$p->category->name . PHP_EOL; echo 'Price: ₹' . \$p->price . PHP_EOL;"
```

---

## Need Help?

- **Category System Documentation:** `CATEGORY_SYSTEM.md`
- **Admin Panel Guide:** `ADMIN_CATEGORY_GUIDE.md`
- **Database Schema:** See `database/migrations/2025_10_01_000002_create_products_table.php`
