<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Courier/Index', [
            'credentials' => [
                'pathao_user' => env('PATHAO_USER'),
                'pathao_password' => env('PATHAO_PASSWORD'),
                'steadfast_user' => env('STEADFAST_USER'),
                'steadfast_password' => env('STEADFAST_PASSWORD'),
                'redx_phone' => env('REDX_PHONE'),
                'redx_password' => env('REDX_PASSWORD'),
            ]
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'pathao_user' => 'nullable|string',
            'pathao_password' => 'nullable|string',
            'steadfast_user' => 'nullable|string',
            'steadfast_password' => 'nullable|string',
            'redx_phone' => 'nullable|string',
            'redx_password' => 'nullable|string',
        ]);

        $this->updateEnv($data);

        return back()->with('success', 'Courier credentials updated successfully.');
    }

    protected function updateEnv(array $data)
    {
        $path = base_path('.env');
        if (file_exists($path)) {
            $env = file_get_contents($path);
            
            $replacements = [
                'PATHAO_USER' => $data['pathao_user'] ?? '',
                'PATHAO_PASSWORD' => $data['pathao_password'] ?? '',
                'STEADFAST_USER' => $data['steadfast_user'] ?? '',
                'STEADFAST_PASSWORD' => $data['steadfast_password'] ?? '',
                'REDX_PHONE' => $data['redx_phone'] ?? '',
                'REDX_PASSWORD' => $data['redx_password'] ?? '',
            ];

            foreach ($replacements as $key => $value) {
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
