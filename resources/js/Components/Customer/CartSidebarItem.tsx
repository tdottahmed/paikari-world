import React, { useState } from "react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useCartStore } from "@/Stores/useCartStore";
import { X, Trash2 } from "lucide-react";
import QuantitySelector from "../Ui/QuantitySelector";
import Image from "../Ui/Image";

interface CartSidebarItemProps {
    item: CartItem;
}

const CartSidebarItem: React.FC<CartSidebarItemProps> = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCartStore();
    const [quantity, setQuantity] = useState<number>(item.quantity ?? 1);

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity < 1) return;
        updateQuantity(item.product_id, newQuantity);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        handleUpdateQuantity(newQuantity);
    };

    const handleRemove = () => {
        removeFromCart(item.product_id);
    };

    return (
        <div className="flex gap-4 p-4 bg-gray-50 rounded-xl relative group">
            <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-red-500 hover:text-red-700"
                aria-label="Remove item"
            >
                <X size={16} />
            </button>

            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                    src={getAssetUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="font-medium text-gray-900">
                            {item.name}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {formatPrice(item.price)} / unit
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="font-bold text-gray-900 text-base">
                            {formatPrice(item.price * quantity)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                        quantity={quantity}
                        onDecrease={() => handleQuantityChange(quantity - 1)}
                        onIncrease={() => handleQuantityChange(quantity + 1)}
                        min={1}
                        max={item.stock}
                        size="sm"
                    />

                    <button
                        onClick={handleRemove}
                        className="text-rose-500 hover:text-red-800 transition-colors p-1 -mr-1 -mt-1 rounded-full hover:bg-red-50"
                        aria-label="Remove item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebarItem;
