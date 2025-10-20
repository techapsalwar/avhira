<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrateProductsToSubcategoriesSeeder extends Seeder
{
    /**
     * Migrate existing products to new subcategory structure
     */
    public function run(): void
    {
        $this->command->info('Migrating products to new subcategory structure...');
        $this->command->newLine();
        
        // Get all subcategories
        $subcategories = DB::table('subcategories')->get()->keyBy('slug');
        
        // Define mapping from old product data to new subcategories
        // Since we don't have the old category data, we'll need to assign based on product analysis
        
        $products = DB::table('products')->get();
        $migrated = 0;
        $unmapped = 0;
        
        foreach ($products as $product) {
            // Try to determine subcategory based on product name/type
            $subcategorySlug = $this->guessSubcategory($product);
            
            if ($subcategorySlug && isset($subcategories[$subcategorySlug])) {
                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['subcategory_id' => $subcategories[$subcategorySlug]->id]);
                
                $this->command->info("✓ {$product->name} → {$subcategories[$subcategorySlug]->name}");
                $migrated++;
            } else {
                // Default to first available subcategory
                $defaultSub = $subcategories->first();
                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['subcategory_id' => $defaultSub->id]);
                
                $this->command->warn("⚠ {$product->name} → {$defaultSub->name} (default)");
                $unmapped++;
            }
        }
        
        $this->command->newLine();
        $this->command->info("========================================");
        $this->command->info("✓ Products Migrated: {$migrated}");
        if ($unmapped > 0) {
            $this->command->warn("⚠ Defaulted: {$unmapped} (review manually)");
        }
        $this->command->info("========================================");
    }
    
    /**
     * Guess subcategory based on product name
     */
    private function guessSubcategory($product): ?string
    {
        $name = strtolower($product->name);
        
        // Men's categories
        if (preg_match('/jacket|blazer/i', $name)) return 'jackets';
        if (preg_match('/full.*sleeve.*shirt/i', $name)) return 'full-sleeve-shirts';
        if (preg_match('/half.*sleeve.*shirt/i', $name)) return 'half-sleeve-shirts';
        if (preg_match('/shirt/i', $name)) return 'full-sleeve-shirts';
        if (preg_match('/short.*kurta/i', $name)) return 'short-kurta';
        if (preg_match('/long.*kurta/i', $name)) return 'long-kurta';
        if (preg_match('/kurta/i', $name)) return 'short-kurta';
        
        // Women's categories
        if (preg_match('/saree/i', $name)) return 'sarees';
        if (preg_match('/peplum/i', $name)) return 'peplum-top';
        if (preg_match('/dress/i', $name)) return 'dress';
        if (preg_match('/dori/i', $name)) return 'dori-tops';
        if (preg_match('/bell.*sleeve/i', $name)) return 'bell-sleeves-kurti';
        if (preg_match('/sleeve.*less.*kurti/i', $name)) return 'sleeve-less-kurti';
        if (preg_match('/full.*sleeve.*kurti/i', $name)) return 'full-sleeve-kurti';
        if (preg_match('/short.*kurti/i', $name)) return 'short-kurtis';
        if (preg_match('/kurti/i', $name)) return 'short-kurtis';
        
        return null;
    }
}
