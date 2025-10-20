<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Get the products for the category.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the parent category (if this is a subcategory).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    /**
     * Get all subcategories (if this is a main category).
     */
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('display_order');
    }

    /**
     * Get all active subcategories.
     */
    public function activeChildren(): HasMany
    {
        return $this->children()->where('is_active', true);
    }

    /**
     * Get all subcategories recursively.
     */
    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }

    /**
     * Check if this is a parent category (main category).
     */
    public function isParent(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Check if this is a main category (no parent).
     */
    public function isMainCategory(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Check if this is a subcategory (has parent).
     */
    public function isChild(): bool
    {
        return !is_null($this->parent_id);
    }

    /**
     * Check if this is a subcategory.
     */
    public function isSubcategory(): bool
    {
        return !is_null($this->parent_id);
    }

    /**
     * Get all products in this category and its subcategories.
     */
    public function getAllProducts()
    {
        if ($this->isMainCategory()) {
            // Get products from all subcategories
            return Product::whereIn('category_id', $this->children()->pluck('id'))->get();
        } else {
            // Get products directly from this category
            return $this->products;
        }
    }

    /**
     * Scope to get only main categories.
     */
    public function scopeMainCategories($query)
    {
        return $query->whereNull('parent_id')->where('is_active', true)->orderBy('display_order');
    }

    /**
     * Scope to get only subcategories.
     */
    public function scopeSubcategories($query)
    {
        return $query->whereNotNull('parent_id')->where('is_active', true)->orderBy('display_order');
    }

    /**
     * Scope to get only active categories.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
