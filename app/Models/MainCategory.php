<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class MainCategory extends Model
{
    protected $fillable = [
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
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug from name if not provided
        static::creating(function ($mainCategory) {
            if (empty($mainCategory->slug)) {
                $mainCategory->slug = Str::slug($mainCategory->name);
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get all subcategories for this main category
     */
    public function subcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class)->orderBy('display_order');
    }

    /**
     * Get only active subcategories
     */
    public function activeSubcategories(): HasMany
    {
        return $this->hasMany(Subcategory::class)->where('is_active', true)->orderBy('display_order');
    }

    /**
     * Get all products across all subcategories
     */
    public function getAllProducts()
    {
        return Product::whereIn('subcategory_id', $this->subcategories->pluck('id'))->get();
    }

    /**
     * Get total product count across all subcategories
     */
    public function getTotalProductsCount(): int
    {
        return Product::whereIn('subcategory_id', $this->subcategories->pluck('id'))->count();
    }

    /**
     * Scope: Get only active main categories
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
}
