<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\DeliveryCharge;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class OrderTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        // Get all products with valid sale prices and delivery charges
        $products = Product::whereNotNull('sale_price')->where('sale_price', '>', 0)->get();
        $deliveryCharges = DeliveryCharge::all();
        
        if ($products->isEmpty() || $deliveryCharges->isEmpty()) {
            $this->command->error('Please seed products and delivery charges first!');
            return;
        }
        
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        // Bangladeshi names for more realistic data
        $firstNames = ['আব্দুল', 'মোহাম্মদ', 'রহিম', 'করিম', 'সালাম', 'জামাল', 'কামাল', 'রফিক', 'শফিক', 'তারেক'];
        $lastNames = ['হোসেন', 'আলী', 'রহমান', 'ইসলাম', 'আহমেদ', 'খান', 'চৌধুরী', 'মিয়া', 'শেখ', 'সরকার'];
        
        $districts = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'];
        
        // Create 50 orders
        for ($i = 1; $i <= 50; $i++) {
            // Random delivery charge
            $deliveryCharge = $deliveryCharges->random();
            
            // Random number of items (1-5 items per order)
            $itemCount = rand(1, 5);
            $subtotal = 0;
            
            // Create the order
            $order = Order::create([
                'customer_name' => $faker->randomElement($firstNames) . ' ' . $faker->randomElement($lastNames),
                'customer_phone' => '01' . rand(3, 9) . rand(10000000, 99999999),
                'customer_address' => $faker->streetAddress . ', ' . $faker->randomElement($districts) . ', Bangladesh',
                'delivery_charge_id' => $deliveryCharge->id,
                'delivery_cost' => $deliveryCharge->cost,
                'subtotal' => 0, // Will update after adding items
                'total' => 0, // Will update after adding items
                'status' => $faker->randomElement($statuses),
                'created_at' => $faker->dateTimeBetween('-3 months', 'now'),
            ]);
            
            // Add random products to the order
            $selectedProducts = $products->random(min($itemCount, $products->count()));
            
            foreach ($selectedProducts as $product) {
                $quantity = rand(1, 10);
                $price = $product->sale_price;
                $itemTotal = $price * $quantity;
                $subtotal += $itemTotal;
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $price,
                ]);
            }
            
            // Update order totals
            $total = $subtotal + $deliveryCharge->cost;
            $order->update([
                'subtotal' => $subtotal,
                'total' => $total,
            ]);
            
            $this->command->info("Created order #{$order->id} with {$itemCount} items - Total: ৳{$total}");
        }
        
        $this->command->info('Successfully created 50 orders with items!');

    }
}
