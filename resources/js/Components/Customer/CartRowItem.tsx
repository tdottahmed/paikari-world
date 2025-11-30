import React, { useState, useEffect } from "react";
import { formatPrice, storagePath } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useDebounce } from "@/Hooks/useDebounce";
import { useCartStore } from "@/Stores/useCartStore";

interface CartRowItemProps {
    item: CartItem;
}

const CartRowItem: React.FC<CartRowItemProps> = ({ item }) => {
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
        <div className= "flex items-center border-b py-4" >
        <img
                src={ storagePath(item.image) }
    alt = { item.name }
    className = "w-24 h-24 object-cover rounded mr-4"
        />
        <div className="flex-grow" >
            <h3 className="text-lg font-semibold" > { item.name } </h3>
                < p className = "text-gray-600" >
                    { " "}
    Price: { formatPrice(item.price) } { " " }
    </p>
        </div>
        < div className = "flex items-center" >
            <button
                    onClick={ () => handleQuantityChange(quantity - 1) }
    className = "bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
    disabled = { quantity <= 1
}
                >
    -
    </button>
    < span className = "px-4 py-1 bg-gray-100" > { quantity } </span>
        < button
onClick = {() => handleQuantityChange(quantity + 1)}
className = "bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300"
    >
    +
    </button>
    </div>
    < div className = "ml-4" >
        <p className="font-semibold" >
            { formatPrice(item.price * quantity) }{ " " }
</p>
    </div>
    < button
onClick = {() => removeItem(item.product_id)}
className = "ml-4 text-red-500 hover:text-red-700"
    >
    <svg
                    xmlns="http://www.w3.org/2000/svg"
className = "h-6 w-6"
fill = "none"
viewBox = "0 0 24 24"
stroke = "currentColor"
    >
    <path
                        strokeLinecap="round"
strokeLinejoin = "round"
strokeWidth = { 2}
d = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
    </svg>
    </button>
    </div>
    );
};

export default CartRowItem;
