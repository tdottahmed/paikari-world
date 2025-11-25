<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query()->with(['items.product', 'deliveryCharge']);

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
            'status' => 'required|in:pending,unreachable,preparing,shipping,completed,canceled,returned',
        ]);

        $order->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Order status updated successfully.');
    }

    public function invoice(Order $order)
    {
        $order->load(['items.product', 'deliveryCharge']);
        // For now, we'll just return the order data to a view or download a PDF.
        // Let's assume we render a simple invoice page for now.
        return Inertia::render('Admin/Order/Invoice', [
            'order' => $order,
        ]);
    }
    public function bulkInvoice(Request $request)
    {
        $ids = explode(',', $request->ids);
        $orders = Order::whereIn('id', $ids)->with(['items.product', 'deliveryCharge'])->get();

        return Inertia::render('Admin/Order/Print', [
            'orders' => $orders,
        ]);
    }

    public function bulkDetails(Request $request)
    {
        $ids = explode(',', $request->ids);
        $orders = Order::whereIn('id', $ids)->with(['items.product', 'deliveryCharge'])->get();

        return Inertia::render('Admin/Order/BulkDetails', [
            'orders' => $orders,
        ]);
    }
}
