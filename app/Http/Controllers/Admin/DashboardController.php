<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return inertia('Dashboard');
    }

    public function settings()
    {
        return inertia('Settings/Index');
    }
}
