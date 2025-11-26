<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PriceCalculatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_price_calculator_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('admin.price-calculator.index'));

        $response->assertStatus(200);
    }

    public function test_admin_can_update_settings()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.price-calculator.update'), [
            'yuan_rate' => '15.5',
            'additional_cost' => '100',
            'profit' => '50',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('settings', ['key' => 'yuan_rate', 'value' => '15.5']);
        $this->assertDatabaseHas('settings', ['key' => 'additional_cost', 'value' => '100']);
        $this->assertDatabaseHas('settings', ['key' => 'profit', 'value' => '50']);
    }

    public function test_get_setting_helper_returns_correct_value()
    {
        Setting::create(['key' => 'test_key', 'value' => 'test_value']);

        $this->assertEquals('test_value', get_setting('test_key'));
        $this->assertEquals('default', get_setting('non_existent_key', 'default'));
    }
}
