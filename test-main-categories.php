<?php

// Test main category with products
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Testing Main Category Products ===\n\n";

// Test Men category
$men = \App\Models\MainCategory::where('slug', 'men')->first();
if ($men) {
    $products = $men->getAllProducts();
    echo "Men Category:\n";
    echo "  - Name: {$men->name}\n";
    echo "  - Subcategories: {$men->subcategories->count()}\n";
    echo "  - Total Products: {$products->count()}\n\n";
    
    if ($products->count() > 0) {
        echo "Sample Products:\n";
        foreach ($products->take(3) as $product) {
            echo "  - {$product->name} (in {$product->subcategory->name})\n";
        }
    }
} else {
    echo "Men category not found!\n";
}

echo "\n";

// Test Women category
$women = \App\Models\MainCategory::where('slug', 'women')->first();
if ($women) {
    $products = $women->getAllProducts();
    echo "Women Category:\n";
    echo "  - Name: {$women->name}\n";
    echo "  - Subcategories: {$women->subcategories->count()}\n";
    echo "  - Total Products: {$products->count()}\n\n";
    
    if ($products->count() > 0) {
        echo "Sample Products:\n";
        foreach ($products->take(3) as $product) {
            echo "  - {$product->name} (in {$product->subcategory->name})\n";
        }
    }
} else {
    echo "Women category not found!\n";
}

echo "\n=== Test Complete! ===\n";
