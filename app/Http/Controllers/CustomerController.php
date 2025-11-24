<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $categories = Category::select('id', 'title', 'slug', 'image')->get();

        $products = Product::with(['category', 'product_variations'])
            ->select('id', 'name', 'slug', 'sale_price', 'stock', 'category_id', 'images')
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/Home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function category(string $category)
    {
        $category = Category::where('slug', $category)->firstOrFail();

        $products = Product::with(['category', 'product_variations'])
            ->select('id', 'name', 'slug', 'sale_price', 'stock', 'category_id', 'images')
            ->where('category_id', $category->id)
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/ProductList', [
            'category' => $category,
            'products' => $products,
        ]);
    }

    public function products()
    {
        $products = Product::with(['category', 'product_variations'])
            ->select('id', 'name', 'slug', 'sale_price', 'stock', 'category_id', 'images')
            ->latest()
            ->paginate(12);

        return Inertia::render('Customer/ProductList', [
            'products' => $products,
        ]);
    }
}
