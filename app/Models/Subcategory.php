<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Subcategory extends Model
{
    protected $fillable = [
        'main_category_id',
        'name',
        'slug',
        'description',
        'image',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
        'main_category_id' => 'integer',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from name if not provided
        static::creating(function ($subcategory) {
            if (empty($subcategory->slug)) {
                $subcategory->slug = Str::slug($subcategory->name);
            }
        });
    }

    /**
     * Get the main category this subcategory belongs to
     */
    public function mainCategory(): BelongsTo
    {
        return $this->belongsTo(MainCategory::class);
    }

    /**
     * Get all products in this subcategory
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get active products only
     */
    public function activeProducts(): HasMany
    {
        return $this->hasMany(Product::class)->where('is_featured', true);
    }

    /**
     * Scope: Get only active subcategories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Order by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    /**
     * Scope: Filter by main category
     */
    public function scopeForMainCategory($query, $mainCategoryId)
    {
        return $query->where('main_category_id', $mainCategoryId);
    }

    /**
     * Get full category path (e.g., "Men → Jackets")
     */
    public function getFullPath(): string
    {
        return $this->mainCategory->name.' → '.$this->name;
    }
}
