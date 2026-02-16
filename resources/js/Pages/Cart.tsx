import React from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { formatPrice } from "@/Utils/helpers";
import CartRowItem from "@/Components/Customer/CartRowItem";
import { useCartStore } from "@/Stores/useCartStore";

import { Toaster, toast } from "sonner";

const Cart = () => {
    const { cart, getCartTotal, getCartCount } = useCartStore();
    const cartItems = Object.values(cart);
    const cartTotal = getCartTotal();

    const handleCheckout = (e: React.MouseEvent) => {
        // Check category-specific minimum order quantities first
        const invalidItems: Array<{ name: string; minQty: number }> = [];
        let hasCategorySpecificRules = false;
        
        cartItems.forEach((item) => {
            let minRequired = 3; // Default minimum is 3
            
            if (item.use_add_cart_qty_as_min && item.add_cart_qty) {
                // If enabled, use add_cart_qty as minimum
                minRequired = item.add_cart_qty;
                hasCategorySpecificRules = true;
            }
            
            if (item.quantity < minRequired) {
                invalidItems.push({
                    name: item.name,
                    minQty: minRequired,
                });
            }
        });

        if (invalidItems.length > 0) {
            e.preventDefault();
            const minQty = invalidItems[0].minQty;
            const itemNames = invalidItems.map((i) => i.name).join(", ");
            toast.warning(
                `Some products require a minimum order quantity of ${minQty}. Please check: ${itemNames}`,
            );
            return;
        }

        // Fallback: Check global minimum order quantity only if no category-specific rules
        if (!hasCategorySpecificRules) {
            const totalCartCount = getCartCount();
            if (totalCartCount < 3) {
                e.preventDefault();
                toast.warning("You have to order at least 3 products");
                return;
            }
        }
    };

    return (
        <CustomerLayout>
            <Head title="Cart" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8"> Shopping Cart </h1>
                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl mb-4"> Your cart is empty.</p>
                        <Link
                            href={route("home")}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {cartItems.map((item) => (
                                <CartRowItem
                                    key={item.product_id}
                                    item={item}
                                />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-gray-100 p-6 rounded-lg">
                                <h2 className="text-xl font-bold mb-4">
                                    {" "}
                                    Order Summary{" "}
                                </h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal </span>
                                    <span className="font-semibold">
                                        {formatPrice(cartTotal)}{" "}
                                    </span>
                                </div>
                                <div className="border-t my-4"> </div>
                                <Link
                                    href={route("checkout.index")}
                                    onClick={handleCheckout}
                                    className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded hover:bg-blue-700 transition font-semibold"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default Cart;
