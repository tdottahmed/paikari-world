import React from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types";
import QuantitySelector from "@/Components/Ui/QuantitySelector";
import { formatPrice } from "@/Utils/helpers";

interface CheckoutItemProps {
    item: CartItem;
    onRemove: (e: React.MouseEvent, id: number) => void;
    onQuantityChange: (
        id: number,
        newQuantity: number,
        e?: React.MouseEvent
    ) => void;
}

export default function CheckoutItem({
    item,
    onRemove,
    onQuantityChange,
}: CheckoutItemProps) {
    return (
        <div className="group relative bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex gap-3">
                {/* Product Image */}
                <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                    {item.image ? (
                        <img
                            src={`/storage/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag size={24} />
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                                {item.name}
                            </h4>
                            <button
                                onClick={(e) => onRemove(e, item.product_id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1 rounded-full hover:bg-red-50"
                                title="Remove item"
                                type="button"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            ৳{formatPrice(item.price)} / unit
                        </p>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                        <div className="font-bold text-gray-900 text-base">
                            ৳{formatPrice(item.price * item.quantity)}
                        </div>

                        {/* Quantity Controls */}
                        <QuantitySelector
                            quantity={item.quantity}
                            onDecrease={() =>
                                onQuantityChange(
                                    item.product_id,
                                    item.quantity - 1
                                )
                            }
                            onIncrease={() =>
                                onQuantityChange(
                                    item.product_id,
                                    item.quantity + 1
                                )
                            }
                            size="sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
