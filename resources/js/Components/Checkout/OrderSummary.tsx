import React from "react";
import { CartItem } from "@/types";
import { formatPrice } from "@/Utils/helpers";
import CheckoutItem from "./CheckoutItem";

interface OrderSummaryProps {
    cartItems: CartItem[];
    cartTotal: number;
    deliveryCost: number;
    discountAmount?: number;
    total: number;
    processing: boolean;
    onRemoveItem: (e: React.MouseEvent, id: number) => void;
    onQuantityChange: (
        id: number,
        newQuantity: number,
        e?: React.MouseEvent
    ) => void;
}

export default function OrderSummary({
    cartItems,
    cartTotal,
    deliveryCost,
    discountAmount = 0,
    total,
    processing,
    onRemoveItem,
    onQuantityChange,
}: OrderSummaryProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                    {" "}
                    Your order{" "}
                </h2>
                <div className="text-sm text-gray-500">
                    Items:{" "}
                    <span className="font-medium text-gray-900">
                        {cartItems.length}
                    </span>{" "}
                    Quantity:{" "}
                    <span className="font-medium text-gray-900">
                        {cartItems.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                        )}
                    </span>
                </div>
            </div>

            {/* Product List */}
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                    <CheckoutItem
                        key={item.product_id}
                        item={item}
                        onRemove={onRemoveItem}
                        onQuantityChange={onQuantityChange}
                    />
                ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Product Total </span>
                    <span className="font-semibold text-gray-900">
                        {formatPrice(cartTotal)}
                    </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charge </span>
                    <span className="font-semibold text-gray-900">
                        {formatPrice(deliveryCost)}
                    </span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Quantity Discount </span>
                        <span> -{formatPrice(discountAmount)} </span>
                    </div>
                )}
                {!discountAmount && (
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Discount </span>
                        <span className="font-semibold text-gray-900">৳0 </span>
                    </div>
                )}

                <div className="pt-4 mt-2 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold text-gray-900">
                            Final Total
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                form="checkout-form"
                disabled={processing}
                className="w-full mt-6 bg-[#1A1A1A] text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            >
                {processing ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Place order
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
}
