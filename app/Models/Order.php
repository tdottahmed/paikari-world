<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'customer_address',
        'delivery_charge_id',
        'delivery_cost',
        'subtotal',
        'total',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function deliveryCharge()
    {
        return $this->belongsTo(DeliveryCharge::class);
    }
    public function courierOrderHistory()
    {
        return $this->hasOne(CourierOrderHistory::class, 'phone', 'customer_phone');
    }
}
