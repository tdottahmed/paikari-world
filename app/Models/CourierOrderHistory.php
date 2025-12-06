<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierOrderHistory extends Model
{
    protected $fillable = [
        'phone',
        'data',
        'success_ratio',
        'total_orders',
        'cancel_orders',
        'last_checked_at',
    ];

    protected $casts = [
        'data' => 'array',
        'last_checked_at' => 'datetime',
        'success_ratio' => 'float',
        'total_orders' => 'integer',
        'cancel_orders' => 'integer',
    ];
    protected $appends = ['successful_orders'];

    public function getSuccessfulOrdersAttribute()
    {
        return $this->total_orders - $this->cancel_orders;
    }
}
