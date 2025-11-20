<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = [];

    protected $casts = [
        'images' => 'json',
        'qty_price' => 'array',
        'buy_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'moq_price' => 'decimal:2',
        'uan_price' => 'decimal:2',
        'stock' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function product_variations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}
