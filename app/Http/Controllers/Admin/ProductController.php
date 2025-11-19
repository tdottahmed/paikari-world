<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index()
    {
        return inertia('Products/Index');
    }

    public function create()
    {
        return inertia('Products/Create');
    }
}
