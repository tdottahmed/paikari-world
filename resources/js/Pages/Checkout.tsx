import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { DeliveryCharge, CartItem } from "@/types";
import { useCartStore } from "@/Stores/useCartStore";
import { ArrowLeft } from "lucide-react";
import CustomerForm from "@/Components/Checkout/CustomerForm";
import DeliveryOptions from "@/Components/Checkout/DeliveryOptions";
import OrderSummary from "@/Components/Checkout/OrderSummary";

export default function Checkout({
    deliveryCharges,
}: {
    deliveryCharges: DeliveryCharge[];
}) {
    const { cart, getCartTotal, updateQuantity, removeFromCart } =
        useCartStore();
    const cartItems: CartItem[] = Object.values(cart);
    const cartTotal = getCartTotal();

    const { data, setData, post, processing, errors } = useForm({
        customer_name: "",
        customer_phone: "",
        customer_address: "",
        delivery_charge_id: "",
        items: cartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
        })),
    });

    // Sync cart items with form data
    useEffect(() => {
        setData(
            "items",
            cartItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
            }))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cart]);

    const [selectedDelivery, setSelectedDelivery] =
        useState<DeliveryCharge | null>(null);

    const total =
        cartTotal + (selectedDelivery ? Number(selectedDelivery.cost) : 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("checkout.store"));
    };

    const handleDeliveryChange = (charge: DeliveryCharge) => {
        setData("delivery_charge_id", charge.id.toString());
        setSelectedDelivery(charge);
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        updateQuantity(id, quantity);
    };

    const handleQuantityChange = (
        id: number,
        newQuantity: number,
        e?: React.MouseEvent
    ) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        handleUpdateQuantity(id, newQuantity);
    };

    const handleRemoveItem = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to remove this item?")) {
            removeFromCart(id);
        }
    };

    return (
        <CustomerLayout>
            <Head title="Checkout" />
            <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4 md:mb-8">
                        <Link
                            href="/"
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </Link>
                        <div className="text-xl font-bold text-[#1A1A1A]">
                            Paikari World
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Form & Delivery */}
                        <div className="lg:col-span-7 space-y-6">
                            <CustomerForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                handleSubmit={handleSubmit}
                            />

                            <DeliveryOptions
                                deliveryCharges={deliveryCharges}
                                selectedId={data.delivery_charge_id}
                                onChange={handleDeliveryChange}
                                error={errors.delivery_charge_id}
                            />
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:col-span-5">
                            <OrderSummary
                                cartItems={cartItems}
                                cartTotal={cartTotal}
                                deliveryCost={
                                    selectedDelivery
                                        ? Number(selectedDelivery.cost)
                                        : 0
                                }
                                total={total}
                                processing={processing}
                                onRemoveItem={handleRemoveItem}
                                onQuantityChange={handleQuantityChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
