<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Setting;

class DiscountController extends Controller
{
    public function index()
    {
        $setting = Setting::where('key', 'quantity_discounts')->first();
        $discounts = $setting ? json_decode($setting->value, true) : [];

        return Inertia::render('Admin/Settings/Discounts/Index', [
            'discounts' => $discounts
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'discounts' => 'array',
            'discounts.*.qty' => 'required|integer|min:1',
            'discounts.*.discount' => 'required|numeric|min:0',
        ]);

        Setting::updateOrCreate(
            ['key' => 'quantity_discounts'],
            ['value' => json_encode($data['discounts'])]
        );

        return back()->with('success', 'Discounts updated successfully');
    }
}
