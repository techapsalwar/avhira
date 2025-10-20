<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class AddJacketProductSeeder extends Seeder
{
    /**
     * Add a sample jacket product to the Jackets category
     */
    public function run(): void
    {
        $this->command->info('Adding new jacket product...');
        
        // Get the Jackets category
        $jacketsCategory = Category::where('slug', 'jackets')->first();
        
        if (!$jacketsCategory) {
            $this->command->error('Jackets category not found!');
            return;
        }
        
        // Create the product
        $product = Product::create([
            'name' => 'Premium Leather Jacket',
            'slug' => 'premium-leather-jacket',
            'category_id' => $jacketsCategory->id,
            'description' => 'High quality leather jacket for men with premium finish and comfortable fit. Perfect for casual and semi-formal occasions.',
            'price' => 4999.00,
            'sale_price' => null, // Optional: set to 3999.00 for sale
            'stock_quantity' => 25,
            'sku' => 'MEN-JKT-001',
            
            // Multiple images (JSON array)
            'images' => json_encode([
                '/images/products/leather-jacket-front.jpg',
                '/images/products/leather-jacket-back.jpg',
                '/images/products/leather-jacket-side.jpg',
            ]),
            
            // Video (optional)
            'video_url' => null, // Set to video URL if available
            
            // Available sizes
            'available_sizes' => json_encode(['S', 'M', 'L', 'XL', 'XXL']),
            
            'is_featured' => true,
            'product_type' => 'clothing',
        ]);
        
        $this->command->info("✓ Product created successfully!");
        $this->command->info("  ID: {$product->id}");
        $this->command->info("  Name: {$product->name}");
        $this->command->info("  Category: {$jacketsCategory->name} (under Men)");
        $this->command->info("  Price: ₹{$product->price}");
        $this->command->info("  SKU: {$product->sku}");
    }
}
