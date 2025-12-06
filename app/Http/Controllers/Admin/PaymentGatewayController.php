<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentGatewayController extends Controller
{
    public function index()
    {
        $bkashEnabled = \App\Models\Setting::where('key', 'bkash_enabled')->value('value') === '1';

        return Inertia::render('Admin/Settings/PaymentGateways/Index', [
            'bkash' => [
                'enabled' => $bkashEnabled,
                'app_key' => env('BKASH_APP_KEY'),
                'app_secret' => env('BKASH_APP_SECRET'),
                'username' => env('BKASH_USERNAME'),
                'password' => env('BKASH_PASSWORD'),
                'base_url' => env('BKASH_BASE_URL'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'bkash_enabled' => 'boolean',
            'bkash_app_key' => 'nullable|string',
            'bkash_app_secret' => 'nullable|string',
            'bkash_username' => 'nullable|string',
            'bkash_password' => 'nullable|string',
            'bkash_base_url' => 'nullable|string',
        ]);

        // Update Settings Table
        \App\Models\Setting::updateOrCreate(
            ['key' => 'bkash_enabled'],
            ['value' => $data['bkash_enabled'] ? '1' : '0']
        );

        // Update .env
        $this->updateEnv([
            'BKASH_APP_KEY' => $data['bkash_app_key'],
            'BKASH_APP_SECRET' => $data['bkash_app_secret'],
            'BKASH_USERNAME' => $data['bkash_username'],
            'BKASH_PASSWORD' => $data['bkash_password'],
            'BKASH_BASE_URL' => $data['bkash_base_url'],
        ]);

        return back()->with('success', 'Payment gateway settings updated successfully.');
    }

    protected function updateEnv(array $data)
    {
        $path = base_path('.env');
        if (file_exists($path)) {
            $env = file_get_contents($path);
            
            foreach ($data as $key => $value) {
                $value = $value ?? '';
                
                // Quote value if it contains spaces
                if (strpos($value, ' ') !== false && strpos($value, '"') === false) {
                    $value = '"' . $value . '"';
                }
                
                // Check if key exists
                if (preg_match("/^{$key}=.*/m", $env)) {
                    $env = preg_replace("/^{$key}=.*/m", "{$key}={$value}", $env);
                } else {
                    $env .= "\n{$key}={$value}";
                }
            }

            file_put_contents($path, $env);
        }
    }
}
