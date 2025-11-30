import React, { useState, useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { formatPrice, storagePath } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useDebounce } from "@/Hooks/useDebounce";
import { useCartStore } from "@/Stores/useCartStore";
import QuantitySelector from "../Ui/QuantitySelector";

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
        setQuantity(newQuantity);
    };

    const removeItem = (id: number) => {
        removeFromCart(id);
    };

    return (
        <div className= "group relative bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300" >
        <div className="flex gap-3" >
            {/* Image */ }
            < div className = "w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 relative" >
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
<div className="flex-1 flex flex-col justify-between min-w-0" >
    <div>
    <div className="flex justify-between items-start gap-2" >
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug" >
            { item.name }
            </h3>
            < button
onClick = {() => removeItem(item.product_id)}
className = "text-rose-500 hover:text-red-800 transition-colors p-1 -mr-1 -mt-1 rounded-full hover:bg-red-50"
    >
    <Trash2 size={ 16 } />
        </button>
        </div>
        < p className = "text-xs text-gray-500 mt-0.5" >
            { formatPrice(item.price) } / unit
            </p>
            </div>

            < div className = "flex items-end justify-between mt-2" >
                <div className="font-bold text-gray-900 text-base" >
                            ৳ { formatPrice(item.price * quantity) }
</div>

    < QuantitySelector
quantity = { quantity }
onDecrease = {() =>
handleQuantityChange(quantity - 1)
                            }
onIncrease = {() =>
handleQuantityChange(quantity + 1)
                            }
min = { 3}
size = "sm"
    />
    </div>
    </div>
    </div>
    </div>
    );
};

export default CartSidebarItem;
