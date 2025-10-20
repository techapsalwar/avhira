<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'subcategory_id',
        'description',
        'price',
        'sale_price',
        'stock_quantity',
        'sku',
        'images',
        'video_url',
        'available_sizes',
        'is_featured',
        'product_type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'images' => 'array',
        'available_sizes' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'sale_price' => 'decimal:2',
    ];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
                
                // Ensure slug is unique
                $originalSlug = $product->slug;
                $counter = 1;
                while (static::where('slug', $product->slug)->exists()) {
                    $product->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });

        static::updating(function ($product) {
            if ($product->isDirty('name') && empty($product->getOriginal('slug'))) {
                $product->slug = Str::slug($product->name);
                
                // Ensure slug is unique
                $originalSlug = $product->slug;
                $counter = 1;
                while (static::where('slug', $product->slug)->where('id', '!=', $product->id)->exists()) {
                    $product->slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }
        });
    }

    /**
     * Get the subcategory that owns the Product.
     */
    public function subcategory()
    {
        return $this->belongsTo(Subcategory::class);
    }

    /**
     * Get the main category through subcategory
     */
    public function mainCategory()
    {
        return $this->hasOneThrough(
            MainCategory::class,
            Subcategory::class,
            'id', // Foreign key on subcategories table
            'id', // Foreign key on main_categories table
            'subcategory_id', // Local key on products table
            'main_category_id' // Local key on subcategories table
        );
    }

    /**
     * Alias for backward compatibility (deprecated, use subcategory())
     */
    public function category()
    {
        return $this->subcategory();
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the primary image URL
     */
    public function getPrimaryImageAttribute()
    {
        if (is_array($this->images) && count($this->images) > 0) {
            return '/storage/' . str_replace('\\', '', $this->images[0]);
        }
        return 'https://via.placeholder.com/600x600.png?text=No+Image';
    }

    /**
     * Get all image URLs
     */
    public function getImageUrlsAttribute()
    {
        if (is_array($this->images)) {
            return array_map(function($image) {
                return '/storage/' . str_replace('\\', '', $image);
            }, $this->images);
        }
        return [];
    }
}
