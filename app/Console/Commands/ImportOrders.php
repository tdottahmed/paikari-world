<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import orders from public/json/orders-pw.json';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = public_path('json/orders-pw.json');

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return;
        }

        $json = file_get_contents($filePath);
        $orders = json_decode($json, true);

        if (!$orders) {
            $this->error("Failed to decode JSON");
            return;
        }

        $this->info("Found " . count($orders) . " orders. Starting import...");

        // Ensure a default delivery charge exists
        // We will try to find or create one based on the order's charge value?
        // Or just map to a generic one? The schema requires delivery_charge_id.
        // Let's create a dynamic "Custom Delivery" charge if needed, or better, reuse one.
        // For simplicity, we'll create a default one.
        $defaultDeliveryCharge = \App\Models\DeliveryCharge::firstOrCreate(
            ['id' => 1],
            ['name' => 'Standard Delivery', 'cost' => 100, 'duration' => '2-3 days']
        );

        $bar = $this->output->createProgressBar(count($orders));
        $bar->start();

        foreach ($orders as $orderData) {
            \Illuminate\Support\Facades\DB::beginTransaction();
            try {
                // Determine delivery charge
                $deliveryCost = $orderData['delivery_charge'] ?? 0;
                // If we want to be precise, we could create charge records for every cost, but that pollutes the table.
                // We'll link to default but override the cost in the Order table (if database allows override or we just store the ID).
                // The Orders table has `delivery_cost` column, so we can store exact cost there.
                // The `delivery_charge_id` is foreign key, so it must exist. We use default.
                
                $createdAt = isset($orderData['created_at']) ? \Carbon\Carbon::createFromTimestamp($orderData['created_at'] / 1000) : now();

                // Order Items Parsing
                $orderItemsRaw = $orderData['order_items'];
                if (is_string($orderItemsRaw)) {
                    $orderItemsRaw = json_decode($orderItemsRaw, true);
                }
                
                $subtotal = 0;
                $formattedItems = [];

                if (is_array($orderItemsRaw)) {
                    foreach ($orderItemsRaw as $item) {
                        $qty = is_array($item['quantity']) ? ($item['quantity'][0] ?? 1) : $item['quantity'];
                        $priceData = isset($item['price']) ? (is_array($item['price']) ? $item['price'][0] : $item['price']) : 0;
                        // price might be object or array of objects in JSON string
                        // From example: "price":[{"buy":73,"sell":100}]
                        
                        $sellPrice = 0;
                        if (is_object($priceData) || is_array($priceData)) {
                             $sellPrice = $priceData['sell'] ?? 0;
                        }

                        $lineTotal = $sellPrice * $qty;
                        $subtotal += $lineTotal;

                        $formattedItems[] = [
                            'product_id' => $item['product_id'],
                            'quantity' => $qty,
                            'price' => $sellPrice,
                        ];
                    }
                }

                $total = $subtotal + $deliveryCost; // - discount etc if needed

                // Create Order
                $order = \App\Models\Order::updateOrCreate(
                    ['id' => $orderData['id']],
                    [
                        'customer_name' => $orderData['name'],
                        'customer_phone' => $orderData['phone'],
                        'customer_address' => $orderData['address'] ?? '',
                        'delivery_charge_id' => $defaultDeliveryCharge->id,
                        'delivery_cost' => $deliveryCost,
                        'subtotal' => $subtotal,
                        'total' => $total,
                        'status' => strtolower($orderData['status'] ?? 'pending'),
                        'created_at' => $createdAt,
                        'updated_at' => $createdAt,
                    ]
                );

                // Create items
                // First delete existing items to avoid duplication on re-run
                $order->items()->delete();

                foreach ($formattedItems as $fItem) {
                    if (\App\Models\Product::where('id', $fItem['product_id'])->exists()) {
                        \App\Models\OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $fItem['product_id'],
                            'quantity' => $fItem['quantity'],
                            'price' => $fItem['price'],
                        ]);
                    } else {
                         // $this->warn("Skipping missing product ID {$fItem['product_id']} for order {$order->id}");
                    }
                }

                \Illuminate\Support\Facades\DB::commit();

            } catch (\Exception $e) {
                \Illuminate\Support\Facades\DB::rollBack();
                $this->error("Error importing order ID {$orderData['id']}: " . $e->getMessage());
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Orders imported successfully.");
    }
}
