<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'buy_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'moq_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'uan_price' => 'required|numeric|min:0',
            'images' => 'required|array|min:1',
            'category' => 'required|exists:categories,id',
            'supplier' => 'required|exists:suppliers,id',
            'qty_prices' => 'sometimes|array',
            'qty_prices.*.qty' => 'required|integer|min:1',
            'qty_prices.*.qty_price' => 'required|numeric|min:0',
            'variations.*.attribute' => 'nullable|exists:product_attributes,id',
            'variations.*.value' => 'nullable|string|max:255',
            'variations.*.stock' => 'nullable|integer|min:0',
            'variations.*.price' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'images.required' => 'At least one product image is required.',
            'images.min' => 'Please upload at least one product image.',
            'qty_prices.*.qty.required' => 'Quantity is required for quantity pricing.',
            'qty_prices.*.qty_price.required' => 'Price is required for quantity pricing.',
            'variations.*.attribute.required' => 'Attribute is required for variation.',
            'variations.*.value.required' => 'Value is required for variation.',
        ];
    }
}
