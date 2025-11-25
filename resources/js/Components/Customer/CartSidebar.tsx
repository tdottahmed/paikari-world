import React from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { Link, usePage, useForm, router } from "@inertiajs/react";

interface CartItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
}

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    const { props } = usePage();
    const cart = (props.cart as Record<string, CartItem>) || {};
    const cartItems = Object.values(cart);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        router.patch(route('cart.update', id), {
            quantity: quantity
        }, {
            preserveScroll: true,
        });
    };

    const removeItem = (id: number) => {
        router.delete(route('cart.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <>
        {/* Backdrop */ }
            {
        isOpen && (
            <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick = { onClose }
            />
            )}

{/* Sidebar */ }
<div
                className={
    `fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
        }`
}
            >
    <div className="flex flex-col h-full" >
        {/* Header */ }
        < div className = "flex items-center justify-between p-4 border-b border-gray-200" >
            <div className="flex items-center gap-2" >
                <ShoppingBag className="text-gray-900" />
                    <h2 className="text-lg font-bold text-gray-900" >
                        Shopping Cart
                            </h2>
                            < span className = "bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full" >
                                { cartItems.length }
                                </span>
                                </div>
                                < button
onClick = { onClose }
className = "p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
    >
    <X size={ 20 } />
        </button>
        </div>

{/* Cart Items */ }
<div className="flex-1 overflow-y-auto p-4 space-y-4" >
{
    cartItems.length === 0 ? (
        <div className= "flex flex-col items-center justify-center h-full text-gray-500" >
        <ShoppingBag
                                    size={ 48 }
className = "mb-4 opacity-20"
    />
    <p>Your cart is empty </p>
        < button
onClick = { onClose }
className = "mt-4 text-indigo-600 font-medium hover:text-indigo-500"
    >
    Start Shopping
        </button>
        </div>
                        ) : (
    cartItems.map((item) => (
        <div
                                    key= { item.product_id }
                                    className = "flex gap-4 bg-gray-50 p-3 rounded-lg"
        >
        <div className="w-20 h-20 bg-white rounded-md border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0" >
    {
        item.image ? (
            <img
                                                src= {`/storage/${item.image}`}
                                                alt = { item.name }
                                                className = "w-full h-full object-cover"
        />
                                        ) : (
    <ShoppingBag
                                                size= { 24}
className = "text-gray-300"
    />
                                        )}
</div>
    < div className = "flex-1 flex flex-col justify-between" >
        <div>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1" >
            { item.name }
            </h3>
            < p className = "text-xs text-gray-500 mt-1" >
                Unit Price: ৳{ item.price }
</p>
    </div>
    < div className = "flex items-center justify-between mt-2" >
        <div className="flex items-center border border-gray-300 rounded-md bg-white" >
            <button
                                                    onClick={
    () =>
        updateQuantity(
            item.product_id,
            item.quantity - 1
        )
}
className = "px-2 py-1 text-gray-600 hover:bg-gray-50 text-xs font-bold"
    >
    -
    </button>
    < span className = "px-2 py-1 text-gray-900 text-xs font-medium border-l border-r border-gray-300 min-w-[30px] text-center" >
        { item.quantity }
        </span>
        < button
onClick = {() =>
updateQuantity(
    item.product_id,
    item.quantity + 1
)
                                                    }
className = "px-2 py-1 text-gray-600 hover:bg-gray-50 text-xs font-bold"
    >
    +
    </button>
    </div>
    < div className = "flex items-center gap-3" >
        <span className="text-sm font-bold text-gray-900" >
                                                    ৳{ item.price * item.quantity }
</span>
    < button
onClick = {() =>
removeItem(item.product_id)
                                                    }
className = "text-red-400 hover:text-red-600 transition-colors"
    >
    <Trash2 size={ 16 } />
        </button>
        </div>
        </div>
        </div>
        </div>
                            ))
                        )}
</div>

{/* Footer */ }
{
    cartItems.length > 0 && (
        <div className="border-t border-gray-200 p-4 space-y-4 bg-gray-50" >
            <div className="space-y-2" >
                <div className="flex justify-between text-sm text-gray-600" >
                    <span>Subtotal </span>
                    <span>৳{ subtotal } </span>
                        </div>
                        < div className = "flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200" >
                            <span>Total </span>
                            <span>৳{ subtotal } </span>
                                </div>
                                < p className = "text-xs text-gray-500 mt-1" >
                                    Shipping and taxes calculated at checkout.
                                </p>
                                        </div>
                                        < Link
    href = { route("checkout.index") }
    className = "w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
        >
        Checkout
        </Link>
        </div>
                    )
}
</div>
    </div>
    </>
    );
};

export default CartSidebar;
