<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $dateRange = $request->input('date_range', 'all');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = \App\Models\Order::query();

        if ($dateRange === 'custom' && $startDate && $endDate) {
            $query->whereBetween('created_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(),
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        } else {
            switch ($dateRange) {
                case 'today':
                    $query->whereDate('created_at', \Carbon\Carbon::today());
                    break;
                case 'yesterday':
                    $query->whereDate('created_at', \Carbon\Carbon::yesterday());
                    break;
                case 'last_week':
                    $query->whereBetween('created_at', [\Carbon\Carbon::now()->subWeek()->startOfDay(), \Carbon\Carbon::now()->endOfDay()]);
                    break;
                case 'last_month':
                    $query->whereBetween('created_at', [\Carbon\Carbon::now()->subMonth()->startOfDay(), \Carbon\Carbon::now()->endOfDay()]);
                    break;
                case 'last_6_months':
                    $query->whereBetween('created_at', [\Carbon\Carbon::now()->subMonths(6)->startOfDay(), \Carbon\Carbon::now()->endOfDay()]);
                    break;
                case 'last_year':
                    $query->whereBetween('created_at', [\Carbon\Carbon::now()->subYear()->startOfDay(), \Carbon\Carbon::now()->endOfDay()]);
                    break;
                case 'all':
                    // No filter
                    break;
                default:
                    $query->whereDate('created_at', \Carbon\Carbon::today());
                    break;
            }
        }

        $orders = $query->with(['items.product'])->get();

        $totalSell = $orders->sum('total');
        
        // Profit Calculation: (Selling Price - Purchase Price) * Quantity
        // Note: Using current product purchase price as historical cost is not stored in order_items
        $profit = $orders->sum(function ($order) {
            return $order->items->sum(function ($item) {
                $purchasePrice = $item->product->purchase_price ?? 0;
                return ($item->price - $purchasePrice) * $item->quantity;
            });
        });

        $completedOrders = $orders->where('status', 'completed');
        $completedSell = $completedOrders->sum('total');
        
        $completedProfit = $completedOrders->sum(function ($order) {
            return $order->items->sum(function ($item) {
                $purchasePrice = $item->product->purchase_price ?? 0;
                return ($item->price - $purchasePrice) * $item->quantity;
            });
        });

        $extraCosts = $orders->sum('delivery_cost');
        $totalOrders = $orders->count();
        $completedOrdersCount = $completedOrders->count();
        $canceledOrders = $orders->where('status', 'canceled')->count();
        
        $totalItems = $orders->sum(function ($order) {
            return $order->items->count();
        });

        $uniqueItems = $orders->pluck('items')->flatten()->pluck('product_id')->unique()->count();
        
        $totalQuantity = $orders->sum(function ($order) {
            return $order->items->sum('quantity');
        });

        $freeDeliveryCount = $orders->where('delivery_cost', 0)->count();

        // Chart Data
        // Sales Trend (Daily)
        $salesTrend = $orders->groupBy(function($date) {
            return \Carbon\Carbon::parse($date->created_at)->format('Y-m-d');
        })->map(function ($row) {
            return $row->sum('total');
        })->map(function ($value, $date) {
            return ['date' => $date, 'sales' => $value];
        })->values();

        // Order Status Distribution
        $orderStatus = $orders->groupBy('status')->map(function ($row, $status) {
            return ['name' => ucfirst($status), 'value' => $row->count()];
        })->values();

        return inertia('Dashboard', [
            'metrics' => [
                'total_sell' => $totalSell,
                'profit' => $profit,
                'completed_sell' => $completedSell,
                'completed_profit' => $completedProfit,
                'extra_costs' => $extraCosts,
                'total_orders' => $totalOrders,
                'completed_orders' => $completedOrdersCount,
                'canceled_orders' => $canceledOrders,
                'total_items' => $totalItems,
                'unique_items' => $uniqueItems,
                'total_quantity' => $totalQuantity,
                'free_delivery' => $freeDeliveryCount,
            ],
            'charts' => [
                'sales_trend' => $salesTrend,
                'order_status' => $orderStatus,
            ],
            'filters' => [
                'date_range' => $dateRange,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    public function settings()
    {
        return inertia('Admin/Settings/Index');
    }
}
