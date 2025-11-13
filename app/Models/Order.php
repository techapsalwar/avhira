<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_pincode',
        'phone',
        'notes',
        'tracking_number',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    protected $with = ['orderItems'];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items for the order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Accessor for items (alias for orderItems)
     */
    public function getItemsAttribute()
    {
        return $this->orderItems;
    }

    /**
     * Generate a unique order number
     */
    public static function generateOrderNumber()
    {
        do {
            $orderNumber = 'AVH-'.strtoupper(uniqid());
        } while (self::where('order_number', $orderNumber)->exists());

        return $orderNumber;
    }
}
