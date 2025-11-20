<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'Apple',
                'email' => 'apple@example.com',
                'phone' => '+91-1234567890',
                'address' => '123 Main Street, Anytown, USA',
            ],
            [
                'name' => 'Samsung',
                'email' => 'samsung@example.com',
                'phone' => '+91-1234567890',
                'address' => '123 Main Street, Anytown, USA',
            ],
            [
                'name' => 'Sony',
                'email' => 'sony@example.com',
                'phone' => '+91-1234567890',
                'address' => '123 Main Street, Anytown, USA',
            ],
        ];

        foreach ($suppliers as $supplier) {
            \App\Models\Supplier::create($supplier);
        }
    }
}
