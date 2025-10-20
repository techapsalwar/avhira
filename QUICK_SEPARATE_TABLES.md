# Quick Reference: Separate Tables Architecture

## ✅ Architecture Change Complete!

### Old Structure → New Structure

**BEFORE (Single Table):**
```
categories (with parent_id)
```

**AFTER (Separate Tables):**
```
main_categories + subcategories
```

---

## Table Structure

### main_categories
```
├── id
├── name (unique)
├── slug (unique)
├── description
├── image
├── display_order
├── is_active
└── timestamps
```

### subcategories
```
├── id
├── main_category_id (FK → main_categories)
├── name
├── slug (unique)
├── description
├── image
├── display_order
├── is_active
└── timestamps
```

### products
```
├── id
├── name
├── subcategory_id (FK → subcategories) ← CHANGED from category_id
├── ... (other fields)
```

---

## Current Data

**Main Categories:** 2
- Men (ID: 1)
- Women (ID: 2)

**Subcategories:** 13
- Men: 5 subcategories
- Women: 8 subcategories

**Products:** 11 (all migrated)

---

## How to Use

### Get Main Category with Subcategories
```php
$men = MainCategory::with('subcategories')->where('slug', 'men')->first();

foreach ($men->subcategories as $sub) {
    echo $sub->name;
}
```

### Get Products in Subcategory
```php
$jackets = Subcategory::where('slug', 'jackets')->first();
$products = $jackets->products;
```

### Add Product to Men → Jackets
```php
Product::create([
    'name' => 'New Jacket',
    'slug' => 'new-jacket',
    'subcategory_id' => 5, // Jackets subcategory ID
    'price' => 3999,
    'stock_quantity' => 10,
    'available_sizes' => json_encode(['M', 'L', 'XL']),
    'product_type' => 'clothing',
]);
```

### Get Full Category Path
```php
$product = Product::find(13);
echo $product->subcategory->getFullPath(); 
// Output: "Men → Jackets"
```

### Add New Main Category (e.g., Kids)
```php
$kids = MainCategory::create([
    'name' => 'Kids',
    'slug' => 'kids',
    'display_order' => 3,
]);

// Add subcategory
Subcategory::create([
    'main_category_id' => $kids->id,
    'name' => 'Boys T-Shirts',
]);
```

---

## Key Changes

### Product Model
```php
// OLD
$product->category_id
$product->category->name

// NEW
$product->subcategory_id
$product->subcategory->name
$product->mainCategory->name

// Backward compatible (still works)
$product->category() // Points to subcategory()
```

### Relationships
```php
// MainCategory
$mainCategory->subcategories
$mainCategory->activeSubcategories
$mainCategory->getAllProducts()

// Subcategory
$subcategory->mainCategory
$subcategory->products
$subcategory->getFullPath()

// Product
$product->subcategory
$product->mainCategory (through subcategory)
```

---

## Benefits

✅ **Clearer Structure**
- No confusion about parent_id
- Explicit separation of main/sub categories

✅ **Better Performance**
- No self-joins needed
- Simpler queries

✅ **Easier to Scale**
- Can add more main categories (Kids, Accessories)
- Independent tables

✅ **Type Safety**
- Products MUST belong to subcategories
- Foreign key constraints enforced

---

## Migration Info

**Migration File:**
`2025_10_20_103558_create_main_categories_and_subcategories_tables.php`

**Seeders:**
- `SeparateTablesSeeder.php` - Seeds categories
- `MigrateProductsToSubcategoriesSeeder.php` - Migrates products

**Models:**
- `app/Models/MainCategory.php`
- `app/Models/Subcategory.php`
- `app/Models/Product.php` (updated)

---

## Rollback

If needed:
```bash
php artisan migrate:rollback --step=1
```

This will:
- Restore old `categories` table with parent_id
- Convert back to single table structure
- Restore all data

---

## Documentation

📚 Full guide: `SEPARATE_TABLES_COMPLETE.md`

---

**Status:** ✅ Ready for Production!
