# Category Migration Summary

## Migration Date: October 20, 2025

### Overview
Migrated from a single `categories` table with hierarchical structure (parent_id) to separate `main_categories` and `subcategories` tables for better organization and scalability.

---

## Database Changes

### Old Structure
- Single `categories` table with `parent_id` for hierarchy
- Products linked via `category_id`

### New Structure
- **`main_categories`** table: Top-level categories (Men, Women, etc.)
  - Fields: id, name, slug, description, image, display_order, is_active
  
- **`subcategories`** table: Categories under main categories
  - Fields: id, main_category_id (FK), name, slug, description, image, display_order, is_active
  
- **`products`** table: Updated foreign key
  - Changed: `category_id` → `subcategory_id`

### Migration File
- `database/migrations/2025_10_20_103558_create_main_categories_and_subcategories_tables.php`

---

## Model Changes

### New Models Created
1. **`app/Models/MainCategory.php`**
   - Relationships: `subcategories()`, `activeSubcategories()`
   - Methods: `getAllProducts()`, `getTotalProductsCount()`
   - Scopes: `active()`, `ordered()`

2. **`app/Models/Subcategory.php`**
   - Relationships: `mainCategory()`, `products()`, `activeProducts()`
   - Methods: `getFullPath()` - Returns "MainCategory → Subcategory"
   - Scopes: `active()`, `ordered()`, `forMainCategory()`

### Updated Models
- **`app/Models/Product.php`**
  - Fillable: `category_id` → `subcategory_id`
  - New relationships: `subcategory()`, `mainCategory()` (via hasOneThrough)
  - Deprecated: `category()` method (kept as alias for backward compatibility)

---

## Controller Updates

### Frontend Controllers
1. **`WelcomeController`** ✅
   - Changed: `Category::all()` → `MainCategory::with('activeSubcategories')`
   - Updated eager loading: `->with('category')` → `->with('subcategory.mainCategory')`

2. **`ProductController`** ✅
   - All queries updated to use `subcategory.mainCategory` eager loading
   - Filter logic updated for new structure

3. **`CategoryController`** ✅
   - Complete rewrite with separate methods:
     - `index()` - List main categories
     - `showMain(MainCategory)` - Show main category with subcategories
     - `showSubcategory(Subcategory)` - Show products in subcategory

### Admin Controllers
4. **`Admin/AdminController`** ✅
   - Stats updated: `total_main_categories`, `total_subcategories`
   - Category sales query rewritten with proper joins

5. **`Admin/AdminProductController`** ✅
   - All CRUD operations updated
   - Validation: `category_id` → `subcategory_id`
   - Data handling: Changed to use `subcategory_id`
   - Filters: Added main_category and subcategory filters
   - Props: `categories` → `mainCategories` + `subcategories`

6. **`Admin/AdminCategoryController`** ✅
   - Complete rewrite with separate management:
     - **Main Categories**: `indexMain()`, `createMain()`, `storeMain()`, `editMain()`, `updateMain()`, `destroyMain()`
     - **Subcategories**: `index()`, `create()`, `store()`, `edit()`, `update()`, `destroy()`

---

## Route Changes

### Admin Routes (`routes/admin.php`)
Added separate route groups:

```php
// Main Categories
Route::get('/categories/main', [AdminCategoryController::class, 'indexMain'])
Route::get('/categories/main/create', [AdminCategoryController::class, 'createMain'])
Route::post('/categories/main', [AdminCategoryController::class, 'storeMain'])
Route::get('/categories/main/{mainCategory}/edit', [AdminCategoryController::class, 'editMain'])
Route::put('/categories/main/{mainCategory}', [AdminCategoryController::class, 'updateMain'])
Route::delete('/categories/main/{mainCategory}', [AdminCategoryController::class, 'destroyMain'])

// Subcategories (existing routes updated)
Route::get('/categories', [AdminCategoryController::class, 'index'])
Route::get('/categories/create', [AdminCategoryController::class, 'create'])
Route::post('/categories', [AdminCategoryController::class, 'store'])
Route::get('/categories/{subcategory}/edit', [AdminCategoryController::class, 'edit'])
Route::put('/categories/{subcategory}', [AdminCategoryController::class, 'update'])
Route::delete('/categories/{subcategory}', [AdminCategoryController::class, 'destroy'])
```

---

## Seeder Updates

### New Seeders
- **`SeparateTablesSeeder.php`**: Seeds main categories, subcategories, and products
- **`MigrateProductsToSubcategoriesSeeder.php`**: One-time migration seeder

### Updated Seeders
- **`DatabaseSeeder.php`** ✅
  - Now calls `SeparateTablesSeeder` instead of old Category logic

---

## Data Migration Results

### Current Data (as of migration)
- **Main Categories**: 2
  1. Men
  2. Women

- **Subcategories**: 13
  - Men: Shirts, T-Shirts, Trousers, Shorts, Kurtas, Jackets, Sweaters
  - Women: Kurtis, Tops, Sarees, Pants, Dresses, Sweaters

- **Products**: 11 (all successfully migrated to subcategories)

---

## Key Points for Frontend Integration

### Product Data Structure
Products now include:
```javascript
{
  id: 1,
  name: "Product Name",
  subcategory_id: 3,
  subcategory: {
    id: 3,
    name: "T-Shirts",
    main_category_id: 1,
    main_category: {
      id: 1,
      name: "Men"
    }
  }
}
```

### Admin Product Forms
- Need to show main category selector first
- Then load subcategories for selected main category
- Save `subcategory_id` (not category_id)

### Category Navigation
- Main categories → Subcategories → Products (3-level hierarchy)
- Each level has its own dedicated page/component

---

## Validation Rules

### Product Creation/Update
```php
'subcategory_id' => 'required|exists:subcategories,id'
```

### Subcategory Creation/Update
```php
'main_category_id' => 'required|exists:main_categories,id'
'name' => 'required|string|max:255' // Must be unique within main category
```

### Main Category Creation/Update
```php
'name' => 'required|string|max:255|unique:main_categories,name'
```

---

## Deprecated Files

### Still Exists (for reference only)
- `app/Models/Category.php` - Old model file (table dropped, model inactive)

**Note**: Can be deleted once all references are confirmed removed.

---

## Testing Checklist

- [ ] Homepage loads with categories
- [ ] Product listing shows correct category hierarchy
- [ ] Product detail shows category breadcrumb
- [ ] Category browsing works (main → sub → products)
- [ ] Admin dashboard stats display correctly
- [ ] Admin product create/edit with category selection
- [ ] Admin product listing with category filters
- [ ] Admin main category CRUD operations
- [ ] Admin subcategory CRUD operations
- [ ] Subcategory names unique within main category
- [ ] Cannot delete main category with subcategories
- [ ] Cannot delete subcategory with products

---

## Rollback Plan (Emergency Only)

If needed to rollback:
1. Restore old categories table from backup
2. Revert migration: `php artisan migrate:rollback`
3. Restore old controller files from git
4. Update Product model back to use category_id

**Note**: Data loss may occur. Always backup before migration.

---

## Future Enhancements

1. Add more main categories (Kids, Accessories, etc.)
2. Implement category images
3. Add category descriptions for SEO
4. Category-specific attributes/filters
5. Hierarchical URL structure (e.g., /men/shirts/casual)

---

## Contact
For questions about this migration, refer to the commit history or contact the development team.
