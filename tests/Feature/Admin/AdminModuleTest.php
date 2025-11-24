<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_new_modules()
    {
        $user = User::factory()->create();

        $modules = [
            'discounts',
            'website',
            'users',
            'payment-gateways',
            'courier',
            'price-calculator',
            'marketing',
        ];

        foreach ($modules as $module) {
            $response = $this->actingAs($user)
                ->get(route("admin.{$module}.index"));

            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page
                ->component("Admin/" . str_replace(' ', '', ucwords(str_replace('-', ' ', $module))) . "/Index")
            );
        }
    }
}
