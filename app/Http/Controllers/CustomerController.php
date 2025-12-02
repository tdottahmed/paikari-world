<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $products = $this->filterProducts($request);
        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();

        return Inertia::render('Customer/Home', [
            'products' => $products,
            'categories' => $categories,
            'website_settings' => $websiteSettings,
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'is_preorder' => $request->input('is_preorder'),
            ],
        ]);
    }

    public function category(Request $request, string $category)
    {
        $category = Category::where('slug', $category)->firstOrFail();

        $products = $this->filterProducts($request, $category->id);

        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();

        return Inertia::render('Customer/Home', [
            'category' => $category,
            'products' => $products,
            'categories' => $categories,
            'website_settings' => $websiteSettings,
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'is_preorder' => $request->input('is_preorder'),
            ],
        ]);
    }

    public function products(Request $request)
    {
        $products = $this->filterProducts($request);

        $websiteSettings = \App\Models\WebsiteSetting::first();
        $categories = Category::select(['id', 'title', 'slug', 'image'])->get();

        return Inertia::render('Customer/Home', [
            'products' => $products,
            'categories' => $categories,
            'website_settings' => $websiteSettings,
            'filters' => [
                'search' => $request->input('search'),
                'min_price' => $request->input('min_price'),
                'max_price' => $request->input('max_price'),
                'sort' => $request->input('sort', 'latest'),
                'in_stock' => $request->input('in_stock'),
                'is_preorder' => $request->input('is_preorder'),
            ],
        ]);
    }

    private function filterProducts(Request $request, ?int $categoryId = null)
    {
        $query = Product::with(['category', 'product_variations'])
            ->select('id', 'name', 'slug', 'sale_price', 'stock', 'category_id', 'images');

        // Filter by category if provided
        if ($categoryId) {
            $query->where('category_id', $categoryId);
        }

        // Search
        if ($search = $request->input('search')) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        // Price range
        if ($minPrice = $request->input('min_price')) {
            $query->where('sale_price', '>=', $minPrice);
        }
        if ($maxPrice = $request->input('max_price')) {
            $query->where('sale_price', '<=', $maxPrice);
        }

        // Stock status
        if ($request->input('in_stock') === 'true') {
            $query->where('stock', '>', 0);
        }

        // Preorder status
        if ($request->input('is_preorder') === 'true') {
            $query->where('is_preorder', true);
        } else {
            $query->where('is_preorder', false);
        }

        // Sorting
        switch ($request->input('sort', 'latest')) {
            case 'price_low':
                $query->orderBy('sale_price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('sale_price', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'latest':
            default:
                $query->latest();
                break;
        }

        return $query->paginate(12)->withQueryString();
    }

    public function show(Product $product)
    {
        $product->load(['category', 'product_variations.product_attribute', 'product_variations.product_attribute', 'supplier']);

        return Inertia::render('Customer/ProductShow', [
            'product' => $product,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q', ''); // Note: using 'q' instead of 'search'

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $products = Product::where('name', 'like', '%' . $query . '%')
            ->select('id', 'name', 'slug', 'sale_price', 'images', 'stock')
            ->limit(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->sale_price,
                    'image' => $product->images[0] ?? null,
                    'stock' => $product->stock,
                    'in_stock' => $product->stock > 0,
                ];
            });

        return response()->json($products);
    }
}
