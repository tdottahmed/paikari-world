<?php

namespace Tests\Feature\Admin;

use App\Models\DeliveryCharge;
use App\Models\User;
use App\Models\WebsiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WebsiteSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_website_settings_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('admin.website.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Settings/Website/Index')
            ->has('setting')
            ->has('deliveryCharges')
        );
    }

    public function test_admin_can_update_banner_settings()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        $file1 = UploadedFile::fake()->image('banner1.jpg');
        $file2 = UploadedFile::fake()->image('banner2.jpg');

        $response = $this->actingAs($user)
            ->post(route('admin.website.update'), [
                'type' => 'banner',
                'banner_active' => true,
                'banner_images' => [$file1, $file2],
                'existing_banner_images' => [],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Verify Banner
        $this->assertDatabaseHas('website_settings', [
            'banner_active' => true,
        ]);
        $setting = WebsiteSetting::first();
        $this->assertCount(2, $setting->banner_images);
        Storage::disk('public')->assertExists($setting->banner_images[0]);
        Storage::disk('public')->assertExists($setting->banner_images[1]);
    }

    public function test_admin_can_update_existing_banner_images()
    {
        Storage::fake('public');
        $user = User::factory()->create();
        
        // Setup existing images
        $existingImage1 = UploadedFile::fake()->image('old1.jpg')->store('banners', 'public');
        $existingImage2 = UploadedFile::fake()->image('old2.jpg')->store('banners', 'public');
        
        WebsiteSetting::create([
            'banner_active' => true,
            'banner_images' => [$existingImage1, $existingImage2],
        ]);

        $newFile = UploadedFile::fake()->image('new.jpg');

        // Keep image1, remove image2, add newFile
        $response = $this->actingAs($user)
            ->post(route('admin.website.update'), [
                'type' => 'banner',
                'banner_active' => true,
                'existing_banner_images' => [$existingImage1],
                'banner_images' => [$newFile],
            ]);

        $response->assertRedirect();
        
        $setting = WebsiteSetting::first();
        $this->assertCount(2, $setting->banner_images);
        $this->assertContains($existingImage1, $setting->banner_images);
        $this->assertNotContains($existingImage2, $setting->banner_images);
        
        Storage::disk('public')->assertExists($existingImage1);
        Storage::disk('public')->assertMissing($existingImage2); // Should be deleted
    }

    public function test_admin_can_update_delivery_charges()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post(route('admin.website.update'), [
                'type' => 'delivery',
                'delivery_charges' => [
                    [
                        'name' => 'Inside Dhaka',
                        'cost' => 80,
                        'duration' => '2/3 Days',
                    ],
                    [
                        'name' => 'Outside Dhaka',
                        'cost' => 150,
                        'duration' => '3/5 Days',
                    ]
                ]
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertCount(2, DeliveryCharge::all());
        $this->assertDatabaseHas('delivery_charges', ['name' => 'Inside Dhaka']);
    }

    public function test_admin_can_update_existing_delivery_charges()
    {
        $user = User::factory()->create();
        $charge = DeliveryCharge::create([
            'name' => 'Old Charge',
            'cost' => 100,
            'duration' => '1 Day',
        ]);

        $response = $this->actingAs($user)
            ->post(route('admin.website.update'), [
                'type' => 'delivery',
                'delivery_charges' => [
                    [
                        'id' => $charge->id,
                        'name' => 'Updated Charge',
                        'cost' => 120,
                        'duration' => '2 Days',
                    ]
                ]
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('delivery_charges', [
            'id' => $charge->id,
            'name' => 'Updated Charge',
            'cost' => 120,
        ]);
    }

    public function test_admin_can_delete_delivery_charges_by_omission()
    {
        $user = User::factory()->create();
        $charge1 = DeliveryCharge::create(['name' => 'Charge 1', 'cost' => 10, 'duration' => '1d']);
        $charge2 = DeliveryCharge::create(['name' => 'Charge 2', 'cost' => 20, 'duration' => '2d']);

        $response = $this->actingAs($user)
            ->post(route('admin.website.update'), [
                'type' => 'delivery',
                'delivery_charges' => [
                    [
                        'id' => $charge1->id,
                        'name' => 'Charge 1',
                        'cost' => 10,
                        'duration' => '1d',
                    ]
                ]
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('delivery_charges', ['id' => $charge1->id]);
        $this->assertDatabaseMissing('delivery_charges', ['id' => $charge2->id]);
    }
}

