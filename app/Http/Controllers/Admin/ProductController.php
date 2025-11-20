<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductVariation;
use App\Models\Supplier;
use App\Utility\FileUpload;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category', 'supplier', 'product_variations')->get();
        return inertia('Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = Category::select(['id', 'title'])->get();
        $supplier = Supplier::select(['id', 'name'])->get();
        $attributes = ProductAttribute::select(['id', 'name'])->get();
        return inertia('Products/Create', [
            'categories' => $categories,
            'suppliers' => $supplier,
            'attributes' => $attributes,
        ]);
    }


    public function store(ProductRequest $request)
    {
        DB::beginTransaction();
        // try {
        $uploadedImages = [];
        if ($request->hasFile('images')) {
            $uploadedImages = FileUpload::uploadImages(
                $request->file('images'),
                'products'
            );
        }
        $qtyPriceData = $this->processQtyPrices($request);
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'purchase_price' => $request->buy_price,
            'sale_price' => $request->sale_price,
            'moq_price' => $request->moq_price,
            'stock' => $request->stock,
            'uan_price' => $request->uan_price,
            'category_id' => $request->category,
            'supplier_id' => $request->supplier,
            'images' => $uploadedImages,
            'qty_price' => $qtyPriceData,
        ]);

        if ($request->has('variations') && !empty($request->variations)) {
            foreach ($request->variations as $variationData) {
                ProductVariation::create([
                    'product_id' => $product->id,
                    'name' => $variationData['attribute'],
                    'value' => $variationData['value'],
                    'stock' => $variationData['stock'] ?? null,
                    'price' => $variationData['price'] ?? null,
                ]);
            }
        }
        DB::commit();

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
        // } catch (\Exception $e) {
        //     DB::rollBack();
        //     if (!empty($uploadedImages)) {
        //         FileUpload::deleteImages($uploadedImages);
        //     }

        //     return back()->with('error', 'Failed to create product: ' . $e->getMessage());
        // }
    }

    protected function processQtyPrices(ProductRequest $request)
    {
        $qtyPrices = [];
        if ($request->has('qty_prices') && !empty($request->qty_prices)) {
            foreach ($request->qty_prices as $qtyPriceData) {
                $qtyPrices[] = [
                    'qty' => (int) $qtyPriceData['qty'],
                    'price' => (float) $qtyPriceData['qty_price'],
                ];
            }
        }
        return $qtyPrices;
    }
}
