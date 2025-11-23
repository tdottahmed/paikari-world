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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category', 'supplier', 'product_variations.product_attribute')->get();
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
        try {
            $uploadedImages = [];
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) {
                    $files = [$files];
                }
                $uploadedImages = FileUpload::uploadImages(
                    $files,
                    'products'
                );
            }
            $qtyPriceData = $this->processQtyPrices($request);
            $product = Product::create([
                'name' => $request->name,
                'description' => $request->description,
                'purchase_price' => $request->purchase_price,
                'sale_price' => $request->sale_price,
                'moq_price' => $request->moq_price,
                'stock' => $request->stock,
                'uan_price' => $request->uan_price,
                'category_id' => $request->category_id,
                'supplier_id' => $request->supplier_id,
                'images' => $uploadedImages,
                'qty_price' => $qtyPriceData,
            ]);

            if ($request->has('variations') && !empty($request->variations)) {
                foreach ($request->variations as $variationData) {
                    ProductVariation::create([
                        'product_id' => $product->id,
                        'product_attribute_id' => $variationData['attribute_id'],
                        'value' => $variationData['value'],
                        'stock' => $variationData['stock'] ?? null,
                        'price' => $variationData['price'] ?? null,
                    ]);
                }
            }
            DB::commit();

            return redirect()->route('admin.products.index')->with('success', 'Product created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            if (!empty($uploadedImages)) {
                FileUpload::deleteImages($uploadedImages);
            }

            return back()->with('error', 'Failed to create product: ' . $e->getMessage());
        }
    }

    public function edit(Product $product)
    {
        $product->load('category', 'supplier', 'product_variations.product_attribute');
        $categories = Category::select(['id', 'title'])->get();
        $supplier = Supplier::select(['id', 'name'])->get();
        $attributes = ProductAttribute::select(['id', 'name'])->get();
        $variations = ProductVariation::where('product_id', $product->id)->get();
        $qtyPrices = Product::where('id', $product->id)->first()->qty_prices;
        return inertia('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'suppliers' => $supplier,
            'attributes' => $attributes,
            'variations' => $variations,
            'qty_prices' => $qtyPrices,
        ]);
    }

    public function update(ProductRequest $request, Product $product)
    {
        $product->load('product_variations');
        DB::beginTransaction();
        try {
            $currentImages = $product->images ?? [];

            if ($request->has('deleted_images')) {
                FileUpload::deleteImages($request->deleted_images);
                $currentImages = array_diff($currentImages, $request->deleted_images);
            }

            if ($request->hasFile('images')) {
                $files = $request->file('images');
                if (!is_array($files)) {
                    $files = [$files];
                }
                $newImages = FileUpload::uploadImages(
                    $files,
                    'products'
                );
                $currentImages = array_merge($currentImages, $newImages);
            }

            $qtyPriceData = $this->processQtyPrices($request);

            $product->update([
                'name' => $request->name,
                'description' => $request->description,
                'purchase_price' => $request->purchase_price,
                'sale_price' => $request->sale_price,
                'moq_price' => $request->moq_price,
                'stock' => $request->stock,
                'uan_price' => $request->uan_price,
                'category_id' => $request->category_id,
                'supplier_id' => $request->supplier_id,
                'images' => $currentImages,
                'qty_price' => $qtyPriceData,
            ]);
            if ($request->has('variations') && !empty($request->variations)) {
                $product->product_variations()->delete();
                foreach ($request->variations as $variationData) {
                    ProductVariation::create([
                        'product_id' => $product->id,
                        'product_attribute_id' => $variationData['attribute_id'],
                        'value' => $variationData['value'],
                        'stock' => $variationData['stock'] ?? null,
                        'price' => $variationData['price'] ?? null,
                    ]);
                }
            } else {
                $product->product_variations()->delete();
            }

            DB::commit();
            return redirect()->route('admin.products.index')->with('success', 'Product updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            if (isset($newImages)) {
                FileUpload::deleteImages($newImages);
            }
            return back()->with('error', 'Failed to update product: ' . $e->getMessage());
        }
    }

    public function show(Product $product)
    {
        $product->load('category', 'supplier', 'product_variations.product_attribute');
        return inertia('Products/Show', [
            'product' => $product,
        ]);
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
