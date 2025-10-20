<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrateProductsToNewCategoriesSeeder extends Seeder
{
    /**
     * Migrate products from old flat categories to new hierarchical subcategories
     */
    public function run(): void
    {
        $this->command->info('Starting product migration to new categories...');
        $this->command->newLine();
        
        // Define the mapping: old_slug => new_slug
        $categoryMapping = [
            'men-shirts' => 'full-sleeve-shirts',
            'short-kurta' => 'short-kurta',  // Under Men
            'women-kurtis' => 'short-kurtis',
            'peplum-tops' => 'peplum-top',
            // 'sarees' has no direct match - will be handled separately
        ];
        
        $migrationLog = [];
        $unmappedProducts = [];
        
        foreach ($categoryMapping as $oldSlug => $newSlug) {
            $oldCategory = Category::where('slug', $oldSlug)->first();
            $newCategory = Category::where('slug', $newSlug)->first();
            
            if (!$oldCategory) {
                $this->command->warn("Old category '{$oldSlug}' not found. Skipping...");
                continue;
            }
            
            if (!$newCategory) {
                $this->command->error("New category '{$newSlug}' not found! Run CategorySeeder first.");
                continue;
            }
            
            $products = $oldCategory->products;
            $count = $products->count();
            
            if ($count > 0) {
                foreach ($products as $product) {
                    $product->category_id = $newCategory->id;
                    $product->save();
                }
                
                $migrationLog[] = [
                    'from' => $oldCategory->name,
                    'to' => $newCategory->name,
                    'count' => $count
                ];
                
                $this->command->info("✓ Migrated {$count} products: {$oldCategory->name} → {$newCategory->name}");
            }
        }
        
        // Handle Sarees separately (no direct match in new structure)
        $sareesCategory = Category::where('slug', 'sarees')->first();
        if ($sareesCategory) {
            $sareesProducts = $sareesCategory->products;
            $count = $sareesProducts->count();
            
            if ($count > 0) {
                $this->command->warn("⚠ Found {$count} products in 'Sarees' category");
                $this->command->info("  Suggestion: Add 'Sarees' as a Women subcategory or reassign to 'Dress'");
                
                // Option: Automatically assign to Dress
                $dressCategory = Category::where('slug', 'dress')->first();
                if ($dressCategory) {
                    $this->command->ask("Move Sarees products to 'Dress' category? (yes/no)", 'no');
                    // For automation, we'll create a Sarees subcategory under Women
                }
                
                $unmappedProducts['sarees'] = $count;
            }
        }
        
        // Summary
        $this->command->newLine();
        $this->command->info('========================================');
        $this->command->info('Product Migration Summary');
        $this->command->info('========================================');
        
        if (!empty($migrationLog)) {
            foreach ($migrationLog as $log) {
                $this->command->info("{$log['from']} → {$log['to']}: {$log['count']} products");
            }
        }
        
        if (!empty($unmappedProducts)) {
            $this->command->newLine();
            $this->command->warn('Unmapped Products:');
            foreach ($unmappedProducts as $category => $count) {
                $this->command->warn("  {$category}: {$count} products (needs manual assignment)");
            }
        }
        
        $this->command->newLine();
        $this->command->info('✓ Product migration completed!');
    }
}
