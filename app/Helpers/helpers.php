<?php

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

if (!function_exists('get_setting')) {
    function get_setting($key, $default = null)
    {
        $setting = Cache::rememberForever('setting_' . $key, function () use ($key) {
            return Setting::where('key', $key)->first();
        });

        return $setting ? $setting->value : $default;
    }
}
