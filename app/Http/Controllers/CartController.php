<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class CartController extends Controller
{
    public function index()
    {
        $cart = session()->get('cart', []);
        return Inertia::render('Cart', ['cart' => $cart]);
    }

    public function store(Request $request)
    {
        $product = Product::findOrFail($request->product_id);
        $cart = session()->get('cart', []);

        $quantity = $request->input('quantity', 1);

        if (isset($cart[$request->product_id])) {
            $cart[$request->product_id]['quantity'] += $quantity;
        } else {
            $cart[$request->product_id] = [
                "product_id" => $product->id,
                "name" => $product->name,
                "quantity" => $quantity,
                "price" => $product->sale_price ?? $product->price,
                "image" => $product->image,
                "slug" => $product->slug
            ];
        }

        session()->put('cart', $cart);
        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function update(Request $request, $id)
    {
        if ($request->id && $request->quantity) {
            $cart = session()->get('cart');
            $cart[$request->id]["quantity"] = $request->quantity;
            session()->put('cart', $cart);
            return redirect()->back()->with('success', 'Cart updated successfully');
        }
    }

    public function destroy($id)
    {
        $cart = session()->get('cart');
        if (isset($cart[$id])) {
            unset($cart[$id]);
            session()->put('cart', $cart);
        }
        return redirect()->back()->with('success', 'Product removed successfully');
    }
}
