<?php

namespace Database\Seeders;

use App\Models\MainCategory;
use App\Models\Subcategory;
use Illuminate\Database\Seeder;

class SeparateTablesSeeder extends Seeder
{
    /**
     * Seed main categories and subcategories in separate tables
     */
    public function run(): void
    {
        $this->command->info('Seeding main categories and subcategories...');
        
        // Men Main Category
        $men = MainCategory::create([
            'name' => 'Men',
            'slug' => 'men',
            'description' => 'Premium men\'s clothing collection',
            'display_order' => 1,
            'is_active' => true,
        ]);
        $this->command->info("✓ Created Main Category: Men");
        
        // Men's Subcategories
        $menSubcategories = [
            ['name' => 'Full Sleeve Shirts', 'order' => 1],
            ['name' => 'Half Sleeve Shirts', 'order' => 2],
            ['name' => 'Short Kurta', 'order' => 3],
            ['name' => 'Long Kurta', 'order' => 4],
            ['name' => 'Jackets', 'order' => 5],
        ];
        
        foreach ($menSubcategories as $sub) {
            Subcategory::create([
                'main_category_id' => $men->id,
                'name' => $sub['name'],
                'display_order' => $sub['order'],
                'is_active' => true,
            ]);
            $this->command->info("  ✓ {$sub['name']}");
        }
        
        // Women Main Category
        $women = MainCategory::create([
            'name' => 'Women',
            'slug' => 'women',
            'description' => 'Premium women\'s clothing collection',
            'display_order' => 2,
            'is_active' => true,
        ]);
        $this->command->info("✓ Created Main Category: Women");
        
        // Women's Subcategories
        $womenSubcategories = [
            ['name' => 'Short Kurtis', 'order' => 1],
            ['name' => 'Sleeve Less Kurti', 'order' => 2],
            ['name' => 'Full Sleeve Kurti', 'order' => 3],
            ['name' => 'Peplum Top', 'order' => 4],
            ['name' => 'Dress', 'order' => 5],
            ['name' => 'Bell Sleeves Kurti', 'order' => 6],
            ['name' => 'Dori Tops', 'order' => 7],
            ['name' => 'Sarees', 'order' => 8],
        ];
        
        foreach ($womenSubcategories as $sub) {
            Subcategory::create([
                'main_category_id' => $women->id,
                'name' => $sub['name'],
                'display_order' => $sub['order'],
                'is_active' => true,
            ]);
            $this->command->info("  ✓ {$sub['name']}");
        }
        
        $this->command->newLine();
        $this->command->info('========================================');
        $this->command->info('✓ Seeding Complete!');
        $this->command->info('  Main Categories: 2');
        $this->command->info('  Men Subcategories: 5');
        $this->command->info('  Women Subcategories: 8');
        $this->command->info('========================================');
    }
}
