<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class RefreshCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting category refresh...');
        
        // Category mapping for product migration
        $categoryMapping = [
            'men-shirts' => 'full-sleeve-shirts',
            'short-kurta' => 'short-kurta', // Will be under Men
            'women-kurtis' => 'short-kurtis',
            'peplum-tops' => 'peplum-top',
            'sarees' => null, // No direct match, keep for manual review
        ];
        
        // Step 1: Migrate products from old categories to new subcategories
        $this->command->info('Step 1: Migrating products to new category structure...');
        
        foreach ($categoryMapping as $oldSlug => $newSlug) {
            $oldCategory = Category::where('slug', $oldSlug)->first();
            
            if ($oldCategory && $newSlug) {
                $productCount = $oldCategory->products()->count();
                
                if ($productCount > 0) {
                    $this->command->warn("Found {$productCount} products in '{$oldCategory->name}' category");
                    $this->command->info("These will need manual reassignment after seeding.");
                }
            }
        }
        
        // Step 2: Clear all categories (this will cascade delete products relationship, not products themselves)
        $this->command->warn('Step 2: Clearing all existing categories...');
        Category::query()->delete();
        $this->command->info('All categories deleted.');
        
        // Step 3: Create fresh hierarchical category structure
        $this->command->info('Step 3: Creating new hierarchical categories...');
        
        // Create main categories
        $menCategory = Category::create([
            'name' => 'Men',
            'slug' => 'men',
            'description' => 'Premium men\'s clothing collection',
            'parent_id' => null,
            'display_order' => 1,
            'is_active' => true,
        ]);
        $this->command->info("✓ Created: Men (Main Category)");
        
        $womenCategory = Category::create([
            'name' => 'Women',
            'slug' => 'women',
            'description' => 'Premium women\'s clothing collection',
            'parent_id' => null,
            'display_order' => 2,
            'is_active' => true,
        ]);
        $this->command->info("✓ Created: Women (Main Category)");
        
        // Men subcategories
        $menSubcategories = [
            ['name' => 'Full Sleeve Shirts', 'order' => 1],
            ['name' => 'Half Sleeve Shirts', 'order' => 2],
            ['name' => 'Short Kurta', 'order' => 3],
            ['name' => 'Long Kurta', 'order' => 4],
            ['name' => 'Jackets', 'order' => 5],
        ];
        
        foreach ($menSubcategories as $sub) {
            Category::create([
                'name' => $sub['name'],
                'slug' => Str::slug($sub['name']),
                'description' => null,
                'parent_id' => $menCategory->id,
                'display_order' => $sub['order'],
                'is_active' => true,
            ]);
            $this->command->info("  ✓ Created: {$sub['name']} (subcategory under Men)");
        }
        
        // Women subcategories
        $womenSubcategories = [
            ['name' => 'Short Kurtis', 'order' => 1],
            ['name' => 'Sleeve Less Kurti', 'order' => 2],
            ['name' => 'Full Sleeve Kurti', 'order' => 3],
            ['name' => 'Peplum Top', 'order' => 4],
            ['name' => 'Dress', 'order' => 5],
            ['name' => 'Bell Sleeves Kurti', 'order' => 6],
            ['name' => 'Dori Tops', 'order' => 7],
        ];
        
        foreach ($womenSubcategories as $sub) {
            Category::create([
                'name' => $sub['name'],
                'slug' => Str::slug($sub['name']),
                'description' => null,
                'parent_id' => $womenCategory->id,
                'display_order' => $sub['order'],
                'is_active' => true,
            ]);
            $this->command->info("  ✓ Created: {$sub['name']} (subcategory under Women)");
        }
        
        // Step 4: Summary
        $this->command->newLine();
        $this->command->info('========================================');
        $this->command->info('Category refresh completed successfully!');
        $this->command->info('========================================');
        $this->command->info('Main Categories: 2 (Men, Women)');
        $this->command->info('Men Subcategories: 5');
        $this->command->info('Women Subcategories: 7');
        $this->command->info('Total Categories: 14');
        $this->command->newLine();
        
        // Check for orphaned products
        $orphanedProducts = Product::whereNull('category_id')
            ->orWhereNotIn('category_id', Category::pluck('id'))
            ->count();
            
        if ($orphanedProducts > 0) {
            $this->command->warn("⚠ Warning: {$orphanedProducts} products need category reassignment!");
            $this->command->info("Run: php artisan tinker");
            $this->command->info("Then reassign products manually or create a migration script.");
        } else {
            $this->command->info("✓ No orphaned products found.");
        }
    }
}
