<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Clear cached setting value when this model changes.
     */
    protected static function booted()
    {
        static::saved(function ($setting) {
            Cache::forget('setting_' . $setting->key);
        });

        static::deleted(function ($setting) {
            Cache::forget('setting_' . $setting->key);
        });

        // Only register restored event if model uses SoftDeletes
        if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class, class_uses_recursive(static::class))) {
            static::restored(function ($setting) {
                Cache::forget('setting_' . $setting->key);
            });
        }
    }
}
