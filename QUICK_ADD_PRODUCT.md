# Quick Reference: Add Product to Men's Jackets

## ✅ Product Successfully Created!

**Product Details:**
- **ID:** 13
- **Name:** Premium Leather Jacket
- **Category Path:** Men → Jackets
- **Price:** ₹4,999.00
- **Stock:** 25 units
- **SKU:** MEN-JKT-001
- **Sizes:** S, M, L, XL, XXL
- **Featured:** Yes ⭐

---

## Quick Add - Copy & Paste Method

### 1️⃣ Using Seeder (Recommended)

**Create file:** `database/seeders/QuickAddJacketSeeder.php`

```php
<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class QuickAddJacketSeeder extends Seeder
{
    public function run(): void
    {
        $jackets = Category::where('slug', 'jackets')->first();
        
        Product::create([
            'name' => 'YOUR PRODUCT NAME HERE',
            'slug' => 'your-product-slug-here',
            'category_id' => $jackets->id,
            'description' => 'Your product description',
            'price' => 3999.00,
            'stock_quantity' => 20,
            'sku' => 'MEN-JKT-XXX',
            'available_sizes' => json_encode(['S', 'M', 'L', 'XL']),
            'is_featured' => false,
            'product_type' => 'clothing',
        ]);
    }
}
```

**Run:**
```bash
php artisan db:seed --class=QuickAddJacketSeeder
```

---

### 2️⃣ Using Tinker (One-liner)

```bash
php artisan tinker
```

Then paste:
```php
Product::create(['name' => 'Bomber Jacket', 'slug' => 'bomber-jacket', 'category_id' => 27, 'description' => 'Stylish bomber jacket', 'price' => 3499, 'stock_quantity' => 15, 'sku' => 'MEN-JKT-002', 'available_sizes' => json_encode(['M','L','XL']), 'is_featured' => true, 'product_type' => 'clothing']);
```

---

## Product Template

```php
[
    'name' => 'Product Name',
    'slug' => 'product-name-slug',
    'category_id' => 27, // Jackets
    'description' => 'Product description goes here',
    'price' => 3999.00,
    'sale_price' => 2999.00, // Optional
    'stock_quantity' => 20,
    'sku' => 'MEN-JKT-XXX', // Optional but recommended
    'images' => json_encode([
        '/images/products/image1.jpg',
        '/images/products/image2.jpg',
    ]),
    'video_url' => null, // Optional
    'available_sizes' => json_encode(['S', 'M', 'L', 'XL', 'XXL']),
    'is_featured' => false,
    'product_type' => 'clothing',
]
```

---

## Category IDs Quick Lookup

```
MEN (21)
├── Full Sleeve Shirts (23)
├── Half Sleeve Shirts (24)
├── Short Kurta (25)
├── Long Kurta (26)
└── Jackets (27) ← YOU ARE HERE

WOMEN (22)
├── Short Kurtis (28)
├── Sleeve Less Kurti (29)
├── Full Sleeve Kurti (30)
├── Peplum Top (31)
├── Dress (32)
├── Bell Sleeves Kurti (33)
├── Dori Tops (34)
└── Sarees (35)
```

---

## Common Product Examples

### Example 1: Winter Jacket
```php
Product::create([
    'name' => 'Winter Puffer Jacket',
    'slug' => 'winter-puffer-jacket',
    'category_id' => 27,
    'description' => 'Warm winter jacket with insulation',
    'price' => 5999.00,
    'stock_quantity' => 10,
    'available_sizes' => json_encode(['M', 'L', 'XL']),
    'is_featured' => true,
    'product_type' => 'clothing',
]);
```

### Example 2: Denim Jacket
```php
Product::create([
    'name' => 'Classic Denim Jacket',
    'slug' => 'classic-denim-jacket',
    'category_id' => 27,
    'description' => 'Timeless blue denim jacket',
    'price' => 2999.00,
    'sale_price' => 2499.00,
    'stock_quantity' => 30,
    'sku' => 'MEN-JKT-DEN-001',
    'available_sizes' => json_encode(['S', 'M', 'L', 'XL', 'XXL']),
    'product_type' => 'clothing',
]);
```

### Example 3: Formal Blazer
```php
Product::create([
    'name' => 'Navy Blue Blazer',
    'slug' => 'navy-blue-blazer',
    'category_id' => 27,
    'description' => 'Elegant navy blue blazer for formal occasions',
    'price' => 6999.00,
    'stock_quantity' => 8,
    'sku' => 'MEN-JKT-BLZ-001',
    'available_sizes' => json_encode(['38', '40', '42', '44', '46']),
    'is_featured' => true,
    'product_type' => 'clothing',
]);
```

---

## Verify Product

```bash
# View product details
php artisan tinker --execute="echo json_encode(Product::find(13)->only(['id', 'name', 'price', 'category_id']), JSON_PRETTY_PRINT);"

# Check products in Jackets category
php artisan tinker --execute="echo 'Products in Jackets: ' . Category::find(27)->products()->count();"
```

---

## Troubleshooting

### ❌ Error: "category_id cannot be null"
**Solution:** Make sure you set `'category_id' => 27` (or the correct category ID)

### ❌ Error: "slug must be unique"
**Solution:** Change the slug to something unique

### ❌ Error: "sku must be unique"
**Solution:** Change the SKU or set it to `null`

### ❌ Error: "Invalid JSON"
**Solution:** Use `json_encode()` for `images` and `available_sizes`:
```php
'images' => json_encode(['/path/to/image.jpg'])
'available_sizes' => json_encode(['S', 'M', 'L'])
```

---

## Full Documentation

📚 For complete guide: See `HOW_TO_ADD_PRODUCTS.md`
