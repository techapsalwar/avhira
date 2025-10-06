<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->unsignedInteger('stock_quantity');
            $table->string('sku')->unique()->nullable();
            
            // Multiple images support (JSON array)
            $table->json('images')->nullable()->comment('Array of product images');
            
            // Video URL or path
            $table->string('video_url')->nullable()->comment('Product video URL or path');
            
            // Size options (JSON array: ['M', 'L', 'XL', 'XXL'])
            $table->json('available_sizes')->nullable()->comment('Available sizes for the product');
            
            $table->boolean('is_featured')->default(false);
            $table->string('product_type')->default('clothing');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
