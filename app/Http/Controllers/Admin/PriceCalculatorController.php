<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class PriceCalculatorController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/PriceCalculator/Index', [
            'settings' => [
                'yuan_rate' => get_setting('yuan_rate'),
                'additional_cost' => get_setting('additional_cost'),
                'profit' => get_setting('profit'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'yuan_rate' => 'required|numeric',
            'additional_cost' => 'required|numeric',
            'profit' => 'required|numeric',
        ]);

        $settings = $request->only(['yuan_rate', 'additional_cost', 'profit']);

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
            Cache::forget('setting_' . $key);
        }

        return back()->with('success', 'Settings updated successfully.');
    }
}
