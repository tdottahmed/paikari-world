<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'title' => 'Electronics',
                'slug' => 'electronics',
                'image' => 'electronics.jpg',
            ],
            [
                'title' => 'Clothing',
                'slug' => 'clothing',
                'image' => 'clothing.jpg',
            ],
            [
                'title' => 'Toys',
                'slug' => 'toys',
                'image' => 'toys.jpg',
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::create($category);
        }
    }
}
