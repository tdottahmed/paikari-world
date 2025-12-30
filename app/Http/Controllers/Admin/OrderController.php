<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with(['items.product', 'deliveryCharge', 'courierOrderHistory']);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                    ->orWhere('customer_phone', 'like', '%' . $request->search . '%')
                    ->orWhere('id', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by Status
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Order/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,unreachable,preparing,shipping,completed,cancelled,returned',
            'create_consignment' => 'nullable|boolean',
            'name' => 'required_if:create_consignment,true|string|max:255',
            'address' => 'required_if:create_consignment,true|string|max:255',
            'phone' => 'required_if:create_consignment,true|string|max:20',
        ]);

        if ($request->create_consignment) {
            // Update Order Details
            $order->update([
                'customer_name' => $request->name,
                'customer_address' => $request->address,
                'customer_phone' => $request->phone,
            ]);

            // Create Consignment
            try {
                $courierData = [
                    'invoice' => (string) $order->id,
                    'recipient_name' => $order->customer_name,
                    'recipient_phone' => $order->customer_phone,
                    'recipient_address' => $order->customer_address,
                    'cod_amount' => $order->total, // Assuming COD amount is total
                    'note' => $order->note ?? 'Order #' . $order->id,
                ];

                $response = \SteadFast\SteadFastCourierLaravelPackage\Facades\SteadfastCourier::placeOrder($courierData);

                if (isset($response['status']) && $response['status'] == 200) {
                    // Consignment created successfully
                    // Maybe save consignment_id or tracking_code if available in response
                    // $response['consignment']['consignment_id']
                } else {

                    if (isset($response['message'])) {
                        return redirect()->back()->with('error', 'Steadfast Error: ' . json_encode($response['message']));
                    }
                    return redirect()->back()->with('error', 'Failed to create consignment with Steadfast.');
                }
            } catch (\Exception $e) {
                return redirect()->back()->with('error', 'Steadfast Exception: ' . $e->getMessage());
            }
        }

        // Handle order cancellation - restore stock
        if ($request->status === 'cancelled' && $order->status !== 'cancelled') {
            DB::transaction(function () use ($order) {
                $order->load('items.product.product_variations');

                foreach ($order->items as $item) {
                    $product = $item->product;

                    if ($product) {
                        // Restore main product stock
                        $product->increment('stock', $item->quantity);

                        // Restore variation stock if variations exist
                        if ($item->variation_ids && is_array($item->variation_ids)) {
                            foreach ($item->variation_ids as $variationId) {
                                $variation = \App\Models\ProductVariation::find($variationId);
                                if ($variation && $variation->stock !== null) {
                                    $variation->increment('stock', $item->quantity);
                                }
                            }
                        }
                    }
                }
            });
        }

        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function invoice(Order $order)
    {
        $order->load([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ]);
        // For now, we'll just return the order data to a view or download a PDF.
        // Let's assume we render a simple invoice page for now.
        return Inertia::render('Admin/Order/Invoice', [
            'order' => $order,
        ]);
    }

    public function show(Order $order)
    {
        $order->load([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ]);

        return Inertia::render('Admin/Order/Show', [
            'order' => $order,
        ]);
    }

    public function bulkInvoice(Request $request)
    {
        $ids = explode(',', $request->ids);
        $orders = Order::whereIn('id', $ids)->with([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ])->get();

        return Inertia::render('Admin/Order/Print', [
            'orders' => $orders,
        ]);
    }

    public function bulkDetails(Request $request)
    {
        $ids = explode(',', $request->ids);
        $orders = Order::whereIn('id', $ids)->with([
            'items.product',
            'items.product.product_variations.product_attribute',
            'deliveryCharge'
        ])->get();

        return Inertia::render('Admin/Order/BulkDetails', [
            'orders' => $orders,
        ]);
    }
    public function checkFraud(Order $order, \App\Services\CourierFraudCheckerService $fraudChecker)
    {
        $result = $fraudChecker->check($order->customer_phone);

        return response()->json($result);
    }
}
