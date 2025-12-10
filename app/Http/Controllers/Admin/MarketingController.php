<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class MarketingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Marketing/Index', [
            'settings' => [
                // Meta Pixel
                'meta_pixel_enabled' => get_setting('meta_pixel_enabled', '0'),
                'meta_pixel_id' => get_setting('meta_pixel_id'),
                'meta_pixel_access_token' => get_setting('meta_pixel_access_token'),
                'meta_pixel_test_code' => get_setting('meta_pixel_test_code'),
                // Google Tag Manager
                'google_tag_manager_enabled' => get_setting('google_tag_manager_enabled', '0'),
                'google_tag_manager_container_id' => get_setting('google_tag_manager_container_id'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            // Meta Pixel
            'meta_pixel_enabled' => 'required|boolean',
            'meta_pixel_id' => 'nullable|string|max:255',
            'meta_pixel_access_token' => 'nullable|string',
            'meta_pixel_test_code' => 'nullable|string|max:255',
            // Google Tag Manager
            'google_tag_manager_enabled' => 'required|boolean',
            'google_tag_manager_container_id' => 'nullable|string|max:255',
        ]);

        $settings = $request->only([
            'meta_pixel_enabled',
            'meta_pixel_id',
            'meta_pixel_access_token',
            'meta_pixel_test_code',
            'google_tag_manager_enabled',
            'google_tag_manager_container_id',
        ]);

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
            Cache::forget('setting_' . $key);
        }

        return back()->with('success', 'Marketing settings updated successfully.');
    }
}
