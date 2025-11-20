<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductAttributeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Color',
            ],
            [
                'name' => 'Size',
            ],
            [
                'name' => 'Material',
            ],
        ];

        foreach ($attributes as $attribute) {
            \App\Models\ProductAttribute::create($attribute);
        }
    }
}
