# Category System Update Summary

## What Was Updated

### 1. Database Migration
**File:** `database/migrations/2025_10_01_000001_create_categories_table.php`

**Changes:**
- Added `parent_id` column (nullable, indexed)
- Added `display_order` column (default: 0)
- Added `is_active` column (default: true)
- Added self-referencing foreign key constraint
- Supports hierarchical category structure

**Schema:**
```
┌─ id
├─ name
├─ slug (unique)
├─ description (nullable)
├─ image (nullable)
├─ parent_id (nullable, foreign key to categories.id)
├─ display_order
├─ is_active
├─ timestamps
```

### 2. Category Model
**File:** `app/Models/Category.php`

**New Methods:**
- `parent()` - Get parent category
- `children()` - Get subcategories (ordered)
- `activeChildren()` - Get active subcategories only
- `allChildren()` - Recursive subcategories
- `isMainCategory()` - Check if main category
- `isSubcategory()` - Check if subcategory
- `getAllProducts()` - Get all products including from subcategories

**New Scopes:**
- `mainCategories()` - Get only main categories
- `subcategories()` - Get only subcategories
- `active()` - Get only active categories

### 3. Category Seeder
**File:** `database/seeders/CategorySeeder.php`

**Populates:**
- **Main Categories:** Men, Women
- **Men's Subcategories (5):**
  1. Full Sleeve Shirts
  2. Half Sleeve Shirts
  3. Short Kurta
  4. Long Kurta
  5. Jackets

- **Women's Subcategories (7):**
  1. Short Kurtis
  2. Sleeve Less Kurti
  3. Full Sleeve Kurti
  4. Peplum Top
  5. Dress
  6. Bell Sleeves Kurti
  7. Dori Tops

## Feature: Add Subcategories from Admin Panel

The system now allows admins to add new subcategories dynamically through the Product creation form.

### Implementation Steps

1. **Create API Endpoint:**
   ```php
   POST /api/admin/categories
   Body: { name, parent_id, description }
   ```

2. **Frontend Component:**
   - Main category selector (Men/Women)
   - Subcategory dropdown
   - "+ Add New Subcategory" button
   - Inline form to create new subcategories

3. **Backend Logic:**
   - Validate parent_id exists and is a main category
   - Auto-generate slug from name
   - Set display_order to next available
   - Mark as active by default

## Usage Examples

### Display Categories in Frontend
```jsx
const categories = await axios.get('/api/categories/main');

// Result:
// [
//   { id: 1, name: "Men", children: [...] },
//   { id: 2, name: "Women", children: [...] }
// ]

{categories.map(main => (
  <div key={main.id}>
    <h2>{main.name}</h2>
    <ul>
      {main.children.map(sub => (
        <li key={sub.id}>{sub.name}</li>
      ))}
    </ul>
  </div>
))}
```

### Get Products for Category
```php
$category = Category::find(1);

// If main category, get all products from subcategories
if ($category->isMainCategory()) {
  $products = $category->getAllProducts();
}

// If subcategory, get products directly
if ($category->isSubcategory()) {
  $products = $category->products;
}
```

### Add New Subcategory (Admin)
```php
Category::create([
  'name' => 'New Subcategory',
  'parent_id' => 2, // Women
  'display_order' => 8,
  'is_active' => true
]);
```

## File Updates

✅ **Updated:**
- `database/migrations/2025_10_01_000001_create_categories_table.php`
- `app/Models/Category.php`

✅ **Created:**
- `database/seeders/CategorySeeder.php` - New seeder with all categories
- `CATEGORY_SYSTEM.md` - System documentation
- `ADMIN_CATEGORY_GUIDE.md` - Admin panel guide with examples

## Next Steps to Deploy

1. **Run Migration (if not done):**
   ```bash
   php artisan migrate
   ```

2. **Seed Initial Data:**
   ```bash
   php artisan db:seed --class=CategorySeeder
   ```

3. **Create Admin Panel UI:**
   - Build category selector component
   - Implement subcategory addition form
   - Add API endpoints

4. **Update Product Form:**
   - Add main category dropdown
   - Add subcategory dropdown with dynamic loading
   - Add "+ New Subcategory" button

## Database Query Examples

### Get Main Categories with Subcategories
```php
$categories = Category::mainCategories()
  ->with('activeChildren')
  ->get();
```

### Get All Products for Men Category
```php
$men = Category::where('slug', 'men')->first();
$products = $men->getAllProducts();
```

### Get Specific Subcategory
```php
$fullSleeveShirts = Category::where('slug', 'full-sleeve-shirts')->first();
$products = $fullSleeveShirts->products()->get();
```

## Important Notes

⚠️ **Cascading Deletes:** Deleting a main category will cascade delete all subcategories and their products. Use care!

✅ **Auto-generated Fields:**
- Slug is auto-generated from name using Str::slug()
- display_order is auto-set to next available number
- is_active defaults to true for new categories

✅ **Display Order:** Used to sort categories in frontend navigation

✅ **Soft Delete (Optional):** Consider implementing soft deletes to prevent accidental data loss

## Architecture

```
Category Hierarchy:
└── Parent_id = NULL (Main Categories)
    ├── Men (id: 1)
    │   ├── Full Sleeve Shirts (parent_id: 1)
    │   ├── Half Sleeve Shirts (parent_id: 1)
    │   ├── Short Kurta (parent_id: 1)
    │   ├── Long Kurta (parent_id: 1)
    │   └── Jackets (parent_id: 1)
    │
    └── Women (id: 2)
        ├── Short Kurtis (parent_id: 2)
        ├── Sleeve Less Kurti (parent_id: 2)
        ├── Full Sleeve Kurti (parent_id: 2)
        ├── Peplum Top (parent_id: 2)
        ├── Dress (parent_id: 2)
        ├── Bell Sleeves Kurti (parent_id: 2)
        └── Dori Tops (parent_id: 2)
```

## Support

For detailed implementation examples, see:
- `CATEGORY_SYSTEM.md` - Technical documentation
- `ADMIN_CATEGORY_GUIDE.md` - Admin panel implementation guide
