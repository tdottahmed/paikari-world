<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DeliveryCharge;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function index()
    {
        $deliveryCharges = DeliveryCharge::all();
        return Inertia::render('Checkout', [
            'deliveryCharges' => $deliveryCharges
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string',
            'customer_phone' => 'required|string',
            'customer_address' => 'required|string',
            'delivery_charge_id' => 'required|exists:delivery_charges,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $cart = $request->items;

        $totalQty = 0;
        $subtotal = 0;
        foreach ($cart as $item) {
            $totalQty += $item['quantity'];
            $subtotal += $item['price'] * $item['quantity'];
        }

        // Calculate discount
        $discountSetting = \App\Models\Setting::where('key', 'quantity_discounts')->value('value');
        $discountRules = $discountSetting ? json_decode($discountSetting, true) : [];

        $discountAmount = 0;
        if (!empty($discountRules)) {
            // Sort by qty desc
            usort($discountRules, function ($a, $b) {
                return $b['qty'] - $a['qty'];
            });

            foreach ($cart as $item) {
                $itemQty = $item['quantity'];
                foreach ($discountRules as $rule) {
                    if ($itemQty >= (int)$rule['qty']) {
                        $discountAmount += $itemQty * (float)$rule['discount'];
                        break;
                    }
                }
            }
        }

        $deliveryCharge = DeliveryCharge::find($request->delivery_charge_id);
        $total = $subtotal + $deliveryCharge->cost - $discountAmount;

        DB::beginTransaction();
        try {
            $order = Order::create([
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_address' => $request->customer_address,
                'delivery_charge_id' => $deliveryCharge->id,
                'delivery_cost' => $deliveryCharge->cost,
                'subtotal' => $subtotal,
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($cart as $item) {
                $product = \App\Models\Product::lockForUpdate()->find($item['product_id']);
                
                if (!$product) {
                    throw new \Exception("Product not found");
                }

                if (!$product->is_preorder && $product->stock < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: " . $product->name);
                }

                $product->decrement('stock', $item['quantity']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            return redirect()->route('order.success', ['order' => $order->id])->with('success', 'Order placed successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Something went wrong. Please try again.');
        }
    }

    public function success(Order $order)
    {
        return Inertia::render('OrderSuccess', ['order' => $order]);
    }

    public function getOrders(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_ids.*' => 'integer',
        ]);

        $orders = Order::whereIn('id', $request->order_ids)
            ->with('items.product') // Eager load items and products
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function destroy(Order $order)
    {
        if ($order->status !== 'pending') {
            return response()->json(['message' => 'Only pending orders can be deleted.'], 403);
        }

        try {
            DB::beginTransaction();

            // Restore stock
            foreach ($order->items as $item) {
                $product = $item->product;
                if ($product) {
                    $product->increment('stock', $item->quantity);
                }
            }

            // Delete order items and order
            $order->items()->delete();
            $order->delete();

            DB::commit();

            return response()->json(['message' => 'Order deleted successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete order.'], 500);
        }
    }
}
