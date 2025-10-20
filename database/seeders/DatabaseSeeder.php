<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MainCategory;
use App\Models\Subcategory;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create default user
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Use SeparateTablesSeeder to create categories and products
        $this->call(SeparateTablesSeeder::class);
    }

    // Deprecated - kept for reference
    private function createProductsForCategoryOld($category)
    {
        $products = [];

        switch ($category->name) {
            case 'Men Shirts':
                $products = [
                    [
                        'name' => 'Classic Black T-Shirt',
                        'description' => 'Premium cotton t-shirt in classic black. Perfect for casual outings and everyday wear. Made with 100% breathable cotton for maximum comfort.',
                        'price' => 999.00,
                        'sale_price' => 799.00,
                        'stock_quantity' => 100,
                        'sku' => 'TSH-BLK-001',
                        'available_sizes' => ['M', 'L', 'XL', 'XXL'],
                        'is_featured' => true,
                    ],
                    [
                        'name' => 'White Cotton T-Shirt',
                        'description' => 'Crisp white cotton t-shirt with modern fit. Essential wardrobe staple that pairs well with everything.',
                        'price' => 899.00,
                        'sale_price' => null,
                        'stock_quantity' => 80,
                        'sku' => 'TSH-WHT-002',
                        'available_sizes' => ['M', 'L', 'XL', 'XXL'],
                        'is_featured' => true,
                    ],
                    [
                        'name' => 'Avhira Red T-Shirt',
                        'description' => 'Bold red t-shirt featuring our signature Avhira style. Stand out with confidence.',
                        'price' => 1099.00,
                        'sale_price' => 899.00,
                        'stock_quantity' => 60,
                        'sku' => 'TSH-RED-003',
                        'available_sizes' => ['M', 'L', 'XL'],
                        'is_featured' => true,
                    ],
                ];
                break;

            case 'Short Kurta':
                $products = [
                    [
                        'name' => 'Formal White Kurta',
                        'description' => 'Elegant formal white kurta perfect for office and formal events. Premium fabric with wrinkle-free technology.',
                        'price' => 1899.00,
                        'sale_price' => 1599.00,
                        'stock_quantity' => 50,
                        'sku' => 'SHT-WHT-001',
                        'available_sizes' => ['M', 'L', 'XL', 'XXL'],
                        'is_featured' => true,
                    ],
                    [
                        'name' => 'Casual Check Shirt',
                        'description' => 'Stylish checkered shirt for casual outings. Comfortable fit with modern patterns.',
                        'price' => 1599.00,
                        'sale_price' => null,
                        'stock_quantity' => 45,
                        'sku' => 'SHT-CHK-002',
                        'available_sizes' => ['M', 'L', 'XL'],
                        'is_featured' => false,
                    ],
                ];
                break;

            case 'Women Kurtis':
                $products = [
                    [
                        'name' => 'Slim Fit Blue Jeans',
                        'description' => 'Classic blue denim jeans with slim fit. Premium quality denim that lasts for years.',
                        'price' => 2499.00,
                        'sale_price' => 1999.00,
                        'stock_quantity' => 70,
                        'sku' => 'JNS-BLU-001',
                        'available_sizes' => ['M', 'L', 'XL', 'XXL'],
                        'is_featured' => true,
                    ],
                    [
                        'name' => 'Black Denim Jeans',
                        'description' => 'Stylish black jeans with comfortable stretch. Perfect for both casual and semi-formal occasions.',
                        'price' => 2699.00,
                        'sale_price' => null,
                        'stock_quantity' => 55,
                        'sku' => 'JNS-BLK-002',
                        'available_sizes' => ['M', 'L', 'XL'],
                        'is_featured' => true,
                    ],
                ];
                break;

            case 'Peplum Tops':
                $products = [
                    [
                        'name' => 'Leather Peplum Top',
                        'description' => 'Premium leather peplum top with modern design. Perfect for adding edge to your outfit.',
                        'price' => 5999.00,
                        'sale_price' => 4999.00,
                        'stock_quantity' => 30,
                        'sku' => 'JKT-LTH-001',
                        'available_sizes' => ['L', 'XL', 'XXL'],
                        'is_featured' => true,
                    ],
                    [
                        'name' => 'Denim Jacket',
                        'description' => 'Classic denim jacket that never goes out of style. Versatile and durable.',
                        'price' => 3499.00,
                        'sale_price' => null,
                        'stock_quantity' => 40,
                        'sku' => 'JKT-DNM-002',
                        'available_sizes' => ['M', 'L', 'XL'],
                        'is_featured' => false,
                    ],
                ];
                break;
            case 'Sarees':
                $products = [
                    [
                        'name' => 'Elegant Silk Saree',
                        'description' => 'Luxurious silk saree with intricate designs. Perfect for weddings and special occasions.',
                        'price' => 7999.00,
                        'sale_price' => 6999.00,
                        'stock_quantity' => 25,
                        'sku' => 'SRE-SLK-001',
                        'available_sizes' => null,
                        'is_featured' => true,
                    ],
                    [
                        'name' => 'Casual Cotton Saree',
                        'description' => 'Comfortable cotton saree for everyday wear. Light and breathable fabric.',
                        'price' => 2999.00,
                        'sale_price' => null,
                        'stock_quantity' => 35,
                        'sku' => 'SRE-CTN-002',
                        'available_sizes' => null,
                        'is_featured' => false,
                    ],
                ];
                break;                                                                    
        }

        foreach ($products as $productData) {
            $productData['category_id'] = $category->id;
            $productData['product_type'] = 'clothing';
            
            // Placeholder images - replace with actual images
            $productData['images'] = [];
            $productData['video_url'] = null;
            
            Product::firstOrCreate(
                ['sku' => $productData['sku']],
                $productData
            );
        }
    }
}

