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
        router.patch(
            route("cart.update", id),
            {
                quantity: quantity,
            },
            {
                preserveScroll: true,
            }
        );
    };

    const removeItem = (id: number) => {
        router.delete(route("cart.destroy", id), {
            preserveScroll: true,
        });
    };

    const totalQuantity = cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar/Bottom Sheet */}
            <div
                className={`fixed z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
                    ${
                        isOpen
                            ? "translate-y-0 md:translate-x-0"
                            : "translate-y-full md:translate-y-0 md:translate-x-full"
                    }
                    inset-x-0 bottom-0 h-[85vh] rounded-t-2xl md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-md md:h-full md:rounded-none`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Shopping Cart
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Items:{" "}
                                <span className="font-bold text-gray-900">
                                    {" "}
                                    {cartItems.length}{" "}
                                </span>{" "}
                                Quantity:{" "}
                                <span className="font-bold text-gray-900">
                                    {" "}
                                    {totalQuantity}{" "}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <ShoppingBag
                                    size={48}
                                    className="mb-4 opacity-20"
                                />
                                <p>Your cart is empty </p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 text-indigo-600 font-medium hover:text-indigo-500"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.product_id}
                                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm relative"
                                >
                                    <div className="flex gap-3">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
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

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">
                                                {item.name}
                                            </h3>
                                            {/* Variant Badge (Placeholder if needed) */}
                                            {/* <span className="inline-block bg-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded mb-1">7</span> */}

                                            <p className="text-xs text-gray-500 font-medium">
                                                ৳{item.price} × {item.quantity}{" "}
                                                pc
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Price & Controls */}
                                    <div className="flex items-end justify-between mt-3">
                                        <div className="font-bold text-gray-900 text-lg">
                                            ৳{item.price * item.quantity}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    removeItem(item.product_id)
                                                }
                                                className="w-8 h-8 flex items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="flex items-center bg-gray-100 rounded-full px-1 h-8">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product_id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    className="w-7 h-full flex items-center justify-center text-gray-600 hover:text-gray-900"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center text-sm font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.product_id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    className="w-7 h-full flex items-center justify-center text-gray-600 hover:text-gray-900"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-4 bg-white border-t border-gray-100">
                            <Link
                                href={route("checkout.index")}
                                className="w-full bg-[#1A1B2E] text-white py-4 rounded-2xl flex items-center justify-between px-6 hover:bg-[#2D2E45] transition-colors shadow-lg"
                            >
                                <span className="text-lg font-bold">
                                    ৳{subtotal}{" "}
                                </span>
                                <div className="flex items-center gap-2 font-medium">
                                    Checkout
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5 12H19M19 12L12 5M19 12L12 19"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
