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
                'name' => 'China',
                'email' => 'china@example.com',
                'phone' => '+91-1234567890'
            ],
            [
                'name' => 'Local',
                'email' => 'local@example.com',
                'phone' => '+91-1234567890',
            ]
        ];

        foreach ($suppliers as $supplier) {
            \App\Models\Supplier::create($supplier);
        }
    }
}
