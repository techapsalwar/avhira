# Subcategories Count Fix for Main Categories

## Date: October 20, 2025

## Issue
The main categories cards were showing "0 subcategories" for all categories, even though they had subcategories associated with them.

**Example:**
```
Men
men
Active
Premium men's clothing collection
0 subcategories  ← Should show actual count (e.g., 5)
```

## Root Cause
In the `AdminCategoryController@index()` method, when loading main categories for the dropdown and display, the query was not including the subcategories count:

```php
$mainCategories = MainCategory::active()->ordered()->get();
```

This query fetches the main categories but doesn't include any relationship counts. The frontend was expecting a `subcategories_count` attribute which Laravel provides when using `withCount()`.

## Solution
Added `withCount('subcategories')` to the query to automatically count related subcategories:

```php
$mainCategories = MainCategory::withCount('subcategories')->active()->ordered()->get();
```

### What `withCount()` Does
- Adds a `{relation}_count` attribute to each model
- In this case: `subcategories_count`
- Performs an efficient COUNT query
- Does not load the actual subcategories (just the count)

## Code Changes

**File:** `app/Http/Controllers/Admin/AdminCategoryController.php`

**Before:**
```php
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
    $mainCategories = MainCategory::active()->ordered()->get();  // ← Missing withCount

    return Inertia::render('Admin/Categories/Index', [
        'subcategories' => $subcategories,
        'mainCategories' => $mainCategories,
        'filters' => $request->only(['search', 'main_category']),
    ]);
}
```

**After:**
```php
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
    $mainCategories = MainCategory::withCount('subcategories')->active()->ordered()->get();  // ✅ Added withCount

    return Inertia::render('Admin/Categories/Index', [
        'subcategories' => $subcategories,
        'mainCategories' => $mainCategories,
        'filters' => $request->only(['search', 'main_category']),
    ]);
}
```

## Frontend Usage
The frontend component (`Index.jsx`) was already correctly referencing the count:

```jsx
<div className="mb-4 text-sm text-gray-500">
    <span>{cat.subcategories_count || 0} subcategories</span>
</div>
```

Now that the backend provides `subcategories_count`, it will display the correct number.

## Expected Results
After this fix, main category cards will show the actual count:

```
Men
men
Active
Premium men's clothing collection
5 subcategories  ✅ Now shows correct count
Edit | Delete

Women
women
Active
Premium women's clothing collection
8 subcategories  ✅ Now shows correct count
Edit | Delete
```

## Testing

### Test Steps:
1. ✅ Go to `/admin/categories`
2. ✅ Click on the "Main Categories" tab
3. ✅ Verify each card shows the correct number of subcategories
4. ✅ The count should match the actual number of subcategories under each main category

### Verification Query:
You can verify the counts in the database:

```sql
SELECT 
    mc.id,
    mc.name,
    COUNT(sc.id) as subcategories_count
FROM main_categories mc
LEFT JOIN subcategories sc ON sc.main_category_id = mc.id
GROUP BY mc.id, mc.name;
```

## Related Files
- ✅ `app/Http/Controllers/Admin/AdminCategoryController.php` - Fixed the query
- ✅ `resources/js/Pages/Admin/Categories/Index.jsx` - Already correct (no changes needed)

## Performance Impact
✅ **Minimal** - The `withCount()` method uses an efficient SQL COUNT subquery:

```sql
SELECT *, (
    SELECT COUNT(*) 
    FROM subcategories 
    WHERE subcategories.main_category_id = main_categories.id
) as subcategories_count
FROM main_categories
WHERE is_active = 1
ORDER BY display_order ASC;
```

This is much more efficient than loading all subcategories with `with('subcategories')`.

## Status
✅ **FIXED** - Main categories now show correct subcategory counts

## Additional Notes
The same `withCount('subcategories')` pattern is already used in the `indexMain()` method (line 17), which is why it would have worked correctly on a separate main categories page. We just needed to apply it to the unified index page as well.
