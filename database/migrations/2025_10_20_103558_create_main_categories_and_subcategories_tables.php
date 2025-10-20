<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Backup existing data
        $existingCategories = DB::table('categories')->get();
        $existingProducts = DB::table('products')->get(['id', 'category_id']);
        
        // Step 2: Drop foreign key constraint from products table
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });
        
        // Step 3: Drop old categories table
        Schema::dropIfExists('categories');
        
        // Step 4: Create main_categories table
        Schema::create('main_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        
        // Step 5: Create subcategories table
        Schema::create('subcategories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('main_category_id')->constrained('main_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Composite unique constraint: name must be unique within each main category
            $table->unique(['main_category_id', 'name']);
        });
        
        // Step 6: Update products table to reference subcategories
        Schema::table('products', function (Blueprint $table) {
            $table->renameColumn('category_id', 'subcategory_id');
        });
        
        // Step 7: Migrate data
        $categoryMapping = [];
        
        // Create main categories from backup
        foreach ($existingCategories->whereNull('parent_id') as $mainCat) {
            $mainId = DB::table('main_categories')->insertGetId([
                'name' => $mainCat->name,
                'slug' => $mainCat->slug,
                'description' => $mainCat->description,
                'image' => $mainCat->image,
                'display_order' => $mainCat->display_order,
                'is_active' => $mainCat->is_active,
                'created_at' => $mainCat->created_at,
                'updated_at' => $mainCat->updated_at,
            ]);
            
            // Create subcategories
            foreach ($existingCategories->where('parent_id', $mainCat->id) as $subCat) {
                $subId = DB::table('subcategories')->insertGetId([
                    'main_category_id' => $mainId,
                    'name' => $subCat->name,
                    'slug' => $subCat->slug,
                    'description' => $subCat->description,
                    'image' => $subCat->image,
                    'display_order' => $subCat->display_order,
                    'is_active' => $subCat->is_active,
                    'created_at' => $subCat->created_at,
                    'updated_at' => $subCat->updated_at,
                ]);
                
                // Map old category ID to new subcategory ID
                $categoryMapping[$subCat->id] = $subId;
            }
        }
        
        // Step 8: Update product references
        foreach ($existingProducts as $product) {
            if (isset($categoryMapping[$product->category_id])) {
                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['subcategory_id' => $categoryMapping[$product->category_id]]);
            }
        }
        
        // Step 9: Add foreign key constraint
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('subcategory_id')
                  ->references('id')
                  ->on('subcategories')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Backup data
        $mainCategories = DB::table('main_categories')->get();
        $subcategories = DB::table('subcategories')->get();
        $products = DB::table('products')->get(['id', 'subcategory_id']);
        
        // Drop foreign key
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['subcategory_id']);
        });
        
        // Rename column back
        Schema::table('products', function (Blueprint $table) {
            $table->renameColumn('subcategory_id', 'category_id');
        });
        
        // Drop new tables
        Schema::dropIfExists('subcategories');
        Schema::dropIfExists('main_categories');
        
        // Recreate old categories table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable()->index();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('parent_id')
                  ->references('id')
                  ->on('categories')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();
        });
        
        // Restore data
        $categoryMapping = [];
        
        foreach ($mainCategories as $main) {
            $mainId = DB::table('categories')->insertGetId([
                'name' => $main->name,
                'slug' => $main->slug,
                'description' => $main->description,
                'image' => $main->image,
                'parent_id' => null,
                'display_order' => $main->display_order,
                'is_active' => $main->is_active,
                'created_at' => $main->created_at,
                'updated_at' => $main->updated_at,
            ]);
            
            foreach ($subcategories->where('main_category_id', $main->id) as $sub) {
                $subId = DB::table('categories')->insertGetId([
                    'name' => $sub->name,
                    'slug' => $sub->slug,
                    'description' => $sub->description,
                    'image' => $sub->image,
                    'parent_id' => $mainId,
                    'display_order' => $sub->display_order,
                    'is_active' => $sub->is_active,
                    'created_at' => $sub->created_at,
                    'updated_at' => $sub->updated_at,
                ]);
                
                $categoryMapping[$sub->id] = $subId;
            }
        }
        
        // Restore product references
        foreach ($products as $product) {
            if (isset($categoryMapping[$product->subcategory_id])) {
                DB::table('products')
                    ->where('id', $product->id)
                    ->update(['category_id' => $categoryMapping[$product->subcategory_id]]);
            }
        }
        
        // Re-add foreign key
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('cascade');
        });
    }
};
