<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'order_number',
        'total_amount',
        'payment_status',
        'delivery_status',
        'shipping_address',
        'phone',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(Str::random(10));
            }
        });
    }

    /**
     * Get the user that placed the order
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get order items for this order
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get payments for this order
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get status history for this order
     */
    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    /**
     * Update payment status and log history
     */
    public function updatePaymentStatus(string $status, ?int $changedBy = null, ?string $notes = null): void
    {
        $oldStatus = $this->payment_status;
        $this->payment_status = $status;
        $this->save();

        $this->statusHistory()->create([
            'status_type' => 'payment',
            'old_status' => $oldStatus,
            'new_status' => $status,
            'changed_by' => $changedBy,
            'notes' => $notes,
        ]);
    }

    /**
     * Update delivery status and log history
     */
    public function updateDeliveryStatus(string $status, ?int $changedBy = null, ?string $notes = null): void
    {
        $oldStatus = $this->delivery_status;
        $this->delivery_status = $status;
        $this->save();

        $this->statusHistory()->create([
            'status_type' => 'delivery',
            'old_status' => $oldStatus,
            'new_status' => $status,
            'changed_by' => $changedBy,
            'notes' => $notes,
        ]);
    }
}

