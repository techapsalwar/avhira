# Category Management System

## Overview
The category system has been redesigned to support a hierarchical structure with main categories and subcategories.

## Structure

### Main Categories
- **Men** (ID: parent_id = null)
- **Women** (ID: parent_id = null)

### Subcategories

#### Men's Subcategories
1. Full Sleeve Shirts
2. Half Sleeve Shirts
3. Short Kurta
4. Long Kurta
5. Jackets

#### Women's Subcategories
1. Short Kurtis
2. Sleeve Less Kurti
3. Full Sleeve Kurti
4. Peplum Top
5. Dress
6. Bell Sleeves Kurti
7. Dori Tops

## Database Schema

### Categories Table
```
id                  - Primary key
name                - Category name
slug                - URL slug (auto-generated)
description         - Category description (nullable)
image               - Category image path (nullable)
parent_id           - Foreign key to parent category (nullable)
display_order       - Sort order for display (default: 0)
is_active           - Active status (default: true)
timestamps          - Created/Updated timestamps
```

## Model Methods

### Relationships
- `parent()` - Get the parent category
- `children()` - Get direct subcategories (ordered by display_order)
- `activeChildren()` - Get only active subcategories
- `allChildren()` - Get all subcategories recursively
- `products()` - Get all products in this category

### Helper Methods
- `isMainCategory()` - Check if this is a main category (no parent)
- `isSubcategory()` - Check if this is a subcategory (has parent)
- `isParent()` - Check if this is a parent category
- `isChild()` - Check if this is a child category
- `getAllProducts()` - Get all products including from subcategories

### Query Scopes
- `mainCategories()` - Get only main categories (active, ordered)
- `subcategories()` - Get only subcategories (active, ordered)
- `active()` - Get only active categories

## Usage Examples

### Get Main Categories with Subcategories
```php
$mainCategories = Category::mainCategories()->with('activeChildren')->get();

foreach ($mainCategories as $main) {
    echo $main->name; // Men, Women
    foreach ($main->activeChildren as $sub) {
        echo $sub->name; // Full Sleeve Shirts, etc.
    }
}
```

### Get Products for a Main Category
```php
$menCategory = Category::where('name', 'Men')->first();
$menProducts = $menCategory->getAllProducts();
```

### Create New Subcategory (Admin Panel)
```php
$women = Category::where('name', 'Women')->first();

Category::create([
    'name' => 'New Subcategory Name',
    'slug' => Str::slug('New Subcategory Name'),
    'parent_id' => $women->id,
    'display_order' => 8, // Next order
    'is_active' => true,
]);
```

## Seeding Data

Run the seeder to populate initial categories:
```bash
php artisan db:seed --class=CategorySeeder
```

This will create:
- 2 main categories (Men, Women)
- 5 Men's subcategories
- 7 Women's subcategories

## Admin Panel Features

### Add New Subcategory
When adding a new product, admin can:
1. Select a main category (Men/Women)
2. See available subcategories
3. Add a new subcategory if needed
4. Subcategories are automatically active and get next display_order

### Edit/Delete Categories
- Can only delete subcategories (main categories may contain products)
- Deleting a main category will cascade delete all subcategories and their products
- Display order can be updated to reorder categories

## Frontend Display

### Navigation
```
Men
  ├── Full Sleeve Shirts
  ├── Half Sleeve Shirts
  ├── Short Kurta
  ├── Long Kurta
  └── Jackets

Women
  ├── Short Kurtis
  ├── Sleeve Less Kurti
  ├── Full Sleeve Kurti
  ├── Peplum Top
  ├── Dress
  ├── Bell Sleeves Kurti
  └── Dori Tops
```

## Migration Info

**File:** `database/migrations/2025_10_01_000001_create_categories_table.php`

**Seeder:** `database/seeders/CategorySeeder.php`

**Model:** `app/Models/Category.php`
