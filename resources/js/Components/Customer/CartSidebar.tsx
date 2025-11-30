import { Link } from "@inertiajs/react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice } from "@/Utils/helpers";
import CartSidebarItem from "./CartSidebarItem";

import { useCartStore } from "@/Stores/useCartStore";
import { toast } from "sonner";

const CartSidebar = () => {
    const { cart, isOpen, setIsOpen, getCartTotal, getCartCount } =
        useCartStore();
    const cartItems = Object.values(cart);
    const cartTotal = getCartTotal();

    const onClose = () => setIsOpen(false);

    const handleCheckout = (e: React.MouseEvent) => {
        if (getCartCount() < 3) {
            e.preventDefault();
            toast.warning("You have to order at least 3 products");
        } else {
            onClose();
        }
    };

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
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Shopping Cart({cartItems.length})
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                                <ShoppingBag size={48} className="opacity-50" />
                                <p className="text-lg font-medium">
                                    Your cart is empty
                                </p>
                                <button
                                    onClick={onClose}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <CartSidebarItem
                                    key={item.product_id}
                                    item={item}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cartItems.length > 0 && (
                        <div className="p-4 border-t bg-gray-50">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal </p>
                                    <p> {formatPrice(cartTotal)} </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={route("checkout.index")}
                                        className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 active:shadow-md"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
