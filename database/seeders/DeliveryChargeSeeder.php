<?php

namespace Database\Seeders;

use App\Models\DeliveryCharge;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeliveryChargeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $charges = [
            [
                'name' => 'Inside Dhaka',
                'cost' => 60,
                'duration' => '2/3 days',
            ],
            [
                'name' => 'Dhaka Subcity',
                'cost' => 80,
                'duration' => '2/3 days',
            ],
            [
                'name' => 'Outside Dhaka',
                'cost' => 120,
                'duration' => '3/4 days',
            ],
        ];

        foreach ($charges as $charge) {
            DeliveryCharge::create($charge);
        }
    }
}
