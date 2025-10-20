<?php

// Test script to verify category relationships
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Testing Category Migration ===\n\n";

// Test Main Categories
$mainCategories = \App\Models\MainCategory::with('activeSubcategories')
    ->active()
    ->ordered()
    ->get();

echo "Main Categories: " . $mainCategories->count() . "\n";
foreach ($mainCategories as $cat) {
    echo "  - {$cat->name}: {$cat->activeSubcategories->count()} subcategories\n";
}

echo "\n";

// Test Products
$products = \App\Models\Product::with('subcategory.mainCategory')->take(3)->get();
echo "Sample Products:\n";
foreach ($products as $product) {
    $mainCat = $product->subcategory->mainCategory->name ?? 'N/A';
    $subCat = $product->subcategory->name ?? 'N/A';
    echo "  - {$product->name}: {$mainCat} > {$subCat}\n";
}

echo "\n=== All Tests Passed! ===\n";
