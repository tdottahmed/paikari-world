<?php

namespace App\Services;

use App\Models\CourierOrderHistory;
use Illuminate\Support\Facades\Log;
use ShahariarAhmad\CourierFraudCheckerBd\Facade\CourierFraudCheckerBd;

class CourierFraudCheckerService
{
    public function check(string $phone)
    {
        $history = CourierOrderHistory::where('phone', $phone)
            ->where('last_checked_at', '>=', now()->subHours(24))
            ->first();

        if ($history) {
            return $history;
        }

        try {
            
            $response = CourierFraudCheckerBd::check($phone);

            $totalOrders = 0;
            $cancelOrders = 0;
            $successOrders = 0;

            foreach ($response as $courier => $stats) {
                $totalOrders += $stats['total'] ?? 0;
                $cancelOrders += $stats['cancel'] ?? 0;
                $successOrders += $stats['success'] ?? 0;
            }

            $successRatio = $totalOrders > 0 ? ($successOrders / $totalOrders) * 100 : 0;

            // Update or Create the record
            $history = CourierOrderHistory::updateOrCreate(
                ['phone' => $phone],
                [
                    'data' => $response,
                    'success_ratio' => $successRatio,
                    'total_orders' => $totalOrders,
                    'cancel_orders' => $cancelOrders,
                    'last_checked_at' => now(),
                ]
            );

            return $history;
        } catch (\Exception $e) {
            Log::error('Courier Fraud Check Error: ' . $e->getMessage());
            return null;
        }
    }
}
