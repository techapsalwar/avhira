<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CompleteRefreshCategoriesSeeder extends Seeder
{
    /**
     * Complete category system refresh with product migration
     */
    public function run(): void
    {
        $this->command->info('╔════════════════════════════════════════╗');
        $this->command->info('║  Complete Category System Refresh     ║');
        $this->command->info('╚════════════════════════════════════════╝');
        $this->command->newLine();
        
        // STEP 1: Backup product-category relationships
        $this->command->info('[1/5] Backing up product-category relationships...');
        $productBackup = Product::with('category')->get()->map(function($product) {
            return [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'old_category_id' => $product->category_id,
                'old_category_name' => $product->category?->name,
                'old_category_slug' => $product->category?->slug,
            ];
        })->toArray();
        
        $backupCount = count($productBackup);
        $this->command->info("✓ Backed up {$backupCount} product relationships");
        $this->command->newLine();
        
        // STEP 2: Create temporary category for product migration
        $this->command->warn('[2/5] Preparing for category cleanup...');
        $oldCount = Category::count();
        
        // Create temporary category to hold products during migration
        $tempCategory = Category::create([
            'name' => '_TEMP_MIGRATION',
            'slug' => '_temp_migration_' . time(),
            'description' => 'Temporary category for migration',
            'parent_id' => null,
            'display_order' => 9999,
            'is_active' => false,
        ]);
        
        // Move all products to temp category
        DB::table('products')->update(['category_id' => $tempCategory->id]);
        
        // Delete all categories except temp
        Category::where('id', '!=', $tempCategory->id)->delete();
        
        $this->command->info("✓ Created temporary migration category");
        $this->command->info("✓ Moved all products to temp category");
        $this->command->info("✓ Deleted {$oldCount} old categories");
        $this->command->newLine();
        
        // STEP 3: Create new hierarchical structure
        $this->command->info('[3/5] Creating new hierarchical category structure...');
        
        // Main categories
        $menCategory = Category::create([
            'name' => 'Men',
            'slug' => 'men',
            'description' => 'Premium men\'s clothing collection',
            'parent_id' => null,
            'display_order' => 1,
            'is_active' => true,
        ]);
        $this->command->info("  ✓ Men (Main Category)");
        
        $womenCategory = Category::create([
            'name' => 'Women',
            'slug' => 'women',
            'description' => 'Premium women\'s clothing collection',
            'parent_id' => null,
            'display_order' => 2,
            'is_active' => true,
        ]);
        $this->command->info("  ✓ Women (Main Category)");
        
        // Men subcategories
        $menSubs = [
            ['name' => 'Full Sleeve Shirts', 'order' => 1],
            ['name' => 'Half Sleeve Shirts', 'order' => 2],
            ['name' => 'Short Kurta', 'order' => 3],
            ['name' => 'Long Kurta', 'order' => 4],
            ['name' => 'Jackets', 'order' => 5],
        ];
        
        $menCategories = [];
        foreach ($menSubs as $sub) {
            $cat = Category::create([
                'name' => $sub['name'],
                'slug' => Str::slug($sub['name']),
                'description' => null,
                'parent_id' => $menCategory->id,
                'display_order' => $sub['order'],
                'is_active' => true,
            ]);
            $menCategories[Str::slug($sub['name'])] = $cat;
            $this->command->info("    ✓ {$sub['name']}");
        }
        
        // Women subcategories
        $womenSubs = [
            ['name' => 'Short Kurtis', 'order' => 1],
            ['name' => 'Sleeve Less Kurti', 'order' => 2],
            ['name' => 'Full Sleeve Kurti', 'order' => 3],
            ['name' => 'Peplum Top', 'order' => 4],
            ['name' => 'Dress', 'order' => 5],
            ['name' => 'Bell Sleeves Kurti', 'order' => 6],
            ['name' => 'Dori Tops', 'order' => 7],
            ['name' => 'Sarees', 'order' => 8], // Adding Sarees here
        ];
        
        $womenCategories = [];
        foreach ($womenSubs as $sub) {
            $cat = Category::create([
                'name' => $sub['name'],
                'slug' => Str::slug($sub['name']),
                'description' => null,
                'parent_id' => $womenCategory->id,
                'display_order' => $sub['order'],
                'is_active' => true,
            ]);
            $womenCategories[Str::slug($sub['name'])] = $cat;
            $this->command->info("    ✓ {$sub['name']}");
        }
        
        $this->command->newLine();
        
        // STEP 4: Migrate products to new categories
        $this->command->info('[4/5] Migrating products to new categories...');
        
        $categoryMapping = [
            'men-shirts' => 'full-sleeve-shirts',
            'short-kurta' => 'short-kurta',
            'women-kurtis' => 'short-kurtis',
            'peplum-tops' => 'peplum-top',
            'sarees' => 'sarees',
        ];
        
        $migrated = 0;
        $unmapped = 0;
        
        foreach ($productBackup as $backup) {
            if (!$backup['old_category_slug']) {
                $unmapped++;
                continue;
            }
            
            $oldSlug = $backup['old_category_slug'];
            
            if (isset($categoryMapping[$oldSlug])) {
                $newSlug = $categoryMapping[$oldSlug];
                $newCategory = Category::where('slug', $newSlug)->first();
                
                if ($newCategory) {
                    DB::table('products')
                        ->where('id', $backup['product_id'])
                        ->update(['category_id' => $newCategory->id]);
                    
                    $migrated++;
                    $this->command->info("  ✓ {$backup['product_name']}: {$backup['old_category_name']} → {$newCategory->name}");
                }
            } else {
                $this->command->warn("  ⚠ No mapping for: {$backup['old_category_name']}");
                $unmapped++;
            }
        }
        
        $this->command->newLine();
        
        // Delete temporary category
        $tempCategory = Category::where('slug', 'like', '_temp_migration_%')->first();
        if ($tempCategory) {
            $tempCategory->delete();
            $this->command->info("✓ Removed temporary migration category");
        }
        
        $this->command->newLine();
        
        // STEP 5: Final summary
        $this->command->info('[5/5] Summary');
        $this->command->info('========================================');
        $this->command->info("✓ Main Categories: 2 (Men, Women)");
        $this->command->info("✓ Men Subcategories: 5");
        $this->command->info("✓ Women Subcategories: 8 (including Sarees)");
        $this->command->info("✓ Total Categories: 15");
        $this->command->info("✓ Products Migrated: {$migrated}");
        
        if ($unmapped > 0) {
            $this->command->warn("⚠ Products Without Category: {$unmapped}");
        }
        
        $this->command->newLine();
        $this->command->info('╔════════════════════════════════════════╗');
        $this->command->info('║  ✓ Category Refresh Completed!        ║');
        $this->command->info('╚════════════════════════════════════════╝');
    }
}
