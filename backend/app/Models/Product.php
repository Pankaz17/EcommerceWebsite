<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'description',
        'price',
        'image',
        'brand',
        'category',
        'size',
        'color',
        'stock_quantity',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    /**
     * Get cart items for this product
     */
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get order items for this product
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Check if product is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /** Threshold below which product is considered low stock */
    public const LOW_STOCK_THRESHOLD = 5;

    /**
     * Check if product is in stock
     */
    public function isInStock(int $quantity = 1): bool
    {
        return $this->stock_quantity >= $quantity;
    }

    /**
     * Check if product is out of stock (quantity = 0).
     */
    public function isOutOfStock(): bool
    {
        return $this->stock_quantity <= 0;
    }

    /**
     * Check if product is low stock (quantity > 0 but < LOW_STOCK_THRESHOLD).
     */
    public function isLowStock(): bool
    {
        return $this->stock_quantity > 0 && $this->stock_quantity < self::LOW_STOCK_THRESHOLD;
    }

    /**
     * Get available sizes as array
     */
    public function getSizesAttribute(): array
    {
        if (empty($this->size)) {
            return [];
        }
        
        // Try to decode as JSON first, fallback to comma-separated
        $sizes = json_decode($this->size, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $sizes;
        }
        
        return array_map('trim', explode(',', $this->size));
    }
}

