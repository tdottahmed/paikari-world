import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { formatPrice, storagePath } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useDebounce } from "@/Hooks/useDebounce";
import { useCartStore } from "@/Stores/useCartStore";

interface CartSidebarItemProps {
    item: CartItem;
}

const CartSidebarItem: React.FC<CartSidebarItemProps> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCartStore();
    const [quantity, setQuantity] = useState(item.quantity);
    const debouncedQuantity = useDebounce(quantity, 500);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    useEffect(() => {
        if (debouncedQuantity !== item.quantity && debouncedQuantity > 0) {
            updateQuantity(item.product_id, debouncedQuantity);
        }
    }, [debouncedQuantity, updateQuantity, item.product_id]);

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
    };

    const removeItem = (id: number) => {
        removeFromCart(id);
    };

    return (
        <div className= "bg-white p-3 rounded-2xl border border-gray-100 shadow-sm relative" >
        <div className="flex gap-3" >
            {/* Image */ }
            < div className = "w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden" >
            {
                item.image ? (
                    <img
                            src= { storagePath(item.image) }
                            alt={ item.name }
                            className="w-full h-full object-cover"
                />
                    ) : (
    <div className= "w-full h-full flex items-center justify-center text-gray-300" >
    <ShoppingBag size={ 24 } />
        </div>
                    )}
</div>

{/* Content */ }
<div className="flex-1 min-w-0" >
    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1" >
        { item.name }
        </h3>

        < p className = "text-xs text-gray-500 font-medium" >
            { formatPrice(item.price) } × { quantity } pc
                </p>
                </div>
                </div>

{/* Bottom Row: Price & Controls */ }
<div className="flex items-end justify-between mt-3" >
    <div className="font-bold text-gray-900 text-lg" >
                    ৳{ item.price * quantity }
</div>

    < div className = "flex items-center gap-2" >
        <button
                        onClick={ () => removeItem(item.product_id) }
className = "w-8 h-8 flex items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
    >
    <Trash2 size={ 14 } />
        </button>

        < div className = "flex items-center bg-gray-100 rounded-full px-1 h-8" >
            <button
                            onClick={ () => handleQuantityChange(quantity - 1) }
className = "w-7 h-full flex items-center justify-center text-gray-600 hover:text-gray-900"
disabled = { quantity <= 1}
                        >
    -
    </button>
    < span className = "w-6 text-center text-sm font-bold text-gray-900" >
        { quantity }
        </span>
        < button
onClick = {() => handleQuantityChange(quantity + 1)}
className = "w-7 h-full flex items-center justify-center text-gray-600 hover:text-gray-900"
    >
    +
    </button>
    </div>
    </div>
    </div>
    </div>
    );
};

export default CartSidebarItem;
