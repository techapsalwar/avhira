<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create main categories
        $menCategory = Category::firstOrCreate(
            ['slug' => 'men'],
            [
                'name' => 'Men',
                'description' => 'Premium men\'s clothing collection',
                'parent_id' => null,
                'display_order' => 1,
                'is_active' => true,
            ]
        );

        $womenCategory = Category::firstOrCreate(
            ['slug' => 'women'],
            [
                'name' => 'Women',
                'description' => 'Premium women\'s clothing collection',
                'parent_id' => null,
                'display_order' => 2,
                'is_active' => true,
            ]
        );

        // Men subcategories
        $menSubcategories = [
            ['name' => 'Full Sleeve Shirts', 'order' => 1],
            ['name' => 'Half Sleeve Shirts', 'order' => 2],
            ['name' => 'Short Kurta', 'order' => 3],
            ['name' => 'Long Kurta', 'order' => 4],
            ['name' => 'Jackets', 'order' => 5],
        ];

        foreach ($menSubcategories as $sub) {
            Category::firstOrCreate(
                ['slug' => Str::slug($sub['name'])],
                [
                    'name' => $sub['name'],
                    'description' => null,
                    'parent_id' => $menCategory->id,
                    'display_order' => $sub['order'],
                    'is_active' => true,
                ]
            );
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
            Category::firstOrCreate(
                ['slug' => Str::slug($sub['name'])],
                [
                    'name' => $sub['name'],
                    'description' => null,
                    'parent_id' => $womenCategory->id,
                    'display_order' => $sub['order'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Categories seeded successfully!');
    }
}
