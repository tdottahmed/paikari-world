<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'images' => 'json',
        'qty_price' => 'array',
        'purchase_price' => 'float',
        'sale_price' => 'float',
        'moq_price' => 'float',
        'uan_price' => 'float',
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
