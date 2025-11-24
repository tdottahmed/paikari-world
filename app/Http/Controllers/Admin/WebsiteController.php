<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WebsiteController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Website/Index');
    }
}
