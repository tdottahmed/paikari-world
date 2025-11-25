import React from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { CartItem } from "@/types";

interface CartProps {
    cart: Record<string, CartItem>;
}

export default function Cart({ cart }: CartProps) {
    const { delete: destroy, patch } = useForm();

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

    const cartItems = Object.values(cart || {});
    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

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
                                <div
                                    key={item.product_id}
                                    className="flex items-center border-b py-4"
                                >
                                    <img
                                        src={
                                            item.image
                                                ? `/storage/${item.image}`
                                                : "/images/placeholder.png"
                                        }
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded mr-4"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold">
                                            {" "}
                                            {item.name}{" "}
                                        </h3>
                                        <p className="text-gray-600">
                                            {" "}
                                            Price: ৳{item.price}{" "}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product_id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 bg-gray-100">
                                            {" "}
                                            {item.quantity}{" "}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product_id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold">
                                            ৳{item.price * item.quantity}{" "}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            removeItem(item.product_id)
                                        }
                                        className="ml-4 text-red-500 hover:text-red-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
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
                                        ৳{subtotal.toFixed(2)}{" "}
                                    </span>
                                </div>
                                <div className="border-t my-4"> </div>
                                <Link
                                    href={route("checkout.index")}
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
}
