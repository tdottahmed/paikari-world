<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryCharge;
use App\Models\WebsiteSetting;
use App\Utility\FileUpload;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Website/Index', [
            'setting' => WebsiteSetting::first() ?? ['banner_active' => true, 'banner_images' => []],
            'deliveryCharges' => DeliveryCharge::all()
        ]);
    }

    public function update(Request $request)
    {
        $type = $request->input('type');

        if ($type === 'banner') {
            $request->validate([
                'banner_active' => 'required|boolean',
                'banner_images' => 'nullable|array',
                'banner_images.*' => 'image|max:2048',
                'existing_banner_images' => 'nullable|array',
                'existing_banner_images.*' => 'string',
            ]);

            $setting = WebsiteSetting::firstOrNew();
            $setting->banner_active = $request->banner_active;

            // Handle Images
            $currentImages = $setting->banner_images ?? [];
            $keptImages = $request->input('existing_banner_images', []);

            // Delete removed images
            $imagesToDelete = array_diff($currentImages, $keptImages);
            if (!empty($imagesToDelete)) {
                FileUpload::deleteImages($imagesToDelete);
            }

            // Upload new images using FileUpload utility
            $newImages = [];
            if ($request->hasFile('banner_images')) {
                $newImages = FileUpload::uploadImages($request->file('banner_images'), 'banners');
            }

            $setting->banner_images = array_merge($keptImages, $newImages);
            $setting->save();

            return back()->with('success', 'Banner settings updated successfully.');
        }

        if ($type === 'delivery') {
            $request->validate([
                'delivery_charges' => 'required|array',
                'delivery_charges.*.id' => 'nullable|integer|exists:delivery_charges,id',
                'delivery_charges.*.name' => 'required|string|max:255',
                'delivery_charges.*.cost' => 'required|numeric|min:0',
                'delivery_charges.*.duration' => 'required|string|max:255',
            ]);

            // Sync Delivery Charges
            $inputCharges = collect($request->delivery_charges);
            $existingChargeIds = $inputCharges->pluck('id')->filter();

            // Delete removed charges
            DeliveryCharge::whereNotIn('id', $existingChargeIds)->delete();

            // Update or Create charges
            foreach ($inputCharges as $chargeData) {
                if (isset($chargeData['id'])) {
                    DeliveryCharge::where('id', $chargeData['id'])->update([
                        'name' => $chargeData['name'],
                        'cost' => $chargeData['cost'],
                        'duration' => $chargeData['duration'],
                    ]);
                } else {
                    DeliveryCharge::create([
                        'name' => $chargeData['name'],
                        'cost' => $chargeData['cost'],
                        'duration' => $chargeData['duration'],
                    ]);
                }
            }
            return back()->with('success', 'Delivery charges updated successfully.');
        }

        return back()->with('error', 'Invalid update type.');
    }
}
