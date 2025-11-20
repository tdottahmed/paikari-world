<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Supplier;

class ProductController extends Controller
{
    public function index()
    {
        return inertia('Products/Index');
    }

    public function create()
    {
        $categories = Category::select(['id', 'title'])->get();
        $supplier = Supplier::select(['id', 'name'])->get();
        return inertia('Products/Create', [
            'categories' => $categories,
            'suppliers' => $supplier,
        ]);
    }
}
