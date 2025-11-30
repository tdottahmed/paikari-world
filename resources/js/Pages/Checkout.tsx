import React, { useState, useEffect } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { DeliveryCharge, CartItem } from "@/types";
import { useCartStore } from "@/Stores/useCartStore";
import {
    User,
    Phone,
    MapPin,
    Minus,
    Plus,
    Trash2,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

export default function Checkout({
    deliveryCharges,
}: {
    deliveryCharges: DeliveryCharge[];
}) {
    const { cart, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCartStore();
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
        e: React.MouseEvent,
        id: number,
        newQuantity: number
    ) => {
        e.preventDefault();
        e.stopPropagation();
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
        <Head title= "Checkout" />
        <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8" >
            <div className="max-w-7xl mx-auto" >
                <div className="flex items-center justify-between mb-8" >
                    <Link
                            href="/"
    className = "p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
            </Link>
            < div className = "text-2xl font-bold text-[#1A1A1A]" >
                Paikari World
                    </div>
                    </div>

                    < div className = "grid grid-cols-1 lg:grid-cols-12 gap-8" >
                        {/* Left Column: Form & Delivery */ }
                        < div className = "lg:col-span-7 space-y-6" >
                            {/* Customer Details Card */ }
                            < div className = "bg-white rounded-2xl p-6 shadow-sm border border-gray-100" >
                                <form
                                    id="checkout-form"
    onSubmit = { handleSubmit }
    className = "space-y-6"
        >
        {/* Name Input */ }
        < div className = "space-y-2" >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1" >
                আপনার নাম{ " " }
    <span className="text-red-500" >
                                                * { " "}
        </span>
        </label>
        < div className = "relative" >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <User className="h-5 w-5 text-gray-400" />
                    </div>
                    < input
    type = "text"
    value = { data.customer_name }
    onChange = {(e) =>
    setData(
        "customer_name",
        e.target.value
    )
}
className = "block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
placeholder = "Enter your name"
    />
    </div>
    </div>

{/* Phone Input */ }
<div className="space-y-2" >
    <div className="flex justify-between" >
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1" >
            মোবাইল নাম্বার{ " " }
<span className="text-red-500" >
                                                    * { " "}
    </span>
    </label>
    < span className = "text-xs text-gray-400" >
        { data.customer_phone.length } /
        11
        </span>
        </div>
        < div className = "relative" >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" >
                <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    < input
type = "tel"
value = { data.customer_phone }
onChange = {(e) =>
setData(
    "customer_phone",
    e.target.value
)
                                                }
maxLength = { 11}
className = {`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${errors.customer_phone
    ? "border-red-500 bg-red-50"
    : "border-gray-200"
    }`}
placeholder = "01XXXXXXXXX"
required
    />
    </div>
{
    errors.customer_phone && (
        <p className="text-red-500 text-xs mt-1" >
            { errors.customer_phone }
            </p>
                                        )
}
</div>

{/* Address Input */ }
<div className="space-y-2" >
    <div className="flex justify-between" >
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1" >
            আপনার ঠিকানা{ " " }
<span className="text-red-500" >
                                                    * { " "}
    </span>
    </label>
    < span className = "text-xs text-gray-400" >
        { data.customer_address.length } /
        255
        </span>
        </div>
        < div className = "relative" >
            <div className="absolute top-3 left-3 pointer-events-none" >
                <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    < textarea
value = { data.customer_address }
onChange = {(e) =>
setData(
    "customer_address",
    e.target.value
)
                                                }
maxLength = { 255}
rows = { 3}
className = {`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none ${errors.customer_address
    ? "border-red-500 bg-red-50"
    : "border-gray-200"
    }`}
placeholder = "Enter full address"
required
    />
    </div>
{
    errors.customer_address && (
        <p className="text-red-500 text-xs mt-1" >
            { errors.customer_address }
            </p>
                                        )
}
</div>
    </form>
    </div>

{/* Delivery Charge Card */ }
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" >
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" >
        <span className="p-1.5 bg-blue-100 rounded-lg" >
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </span>
                                    Delivery Charge
    </h3>
    < div className = "space-y-3" >
    {
        deliveryCharges.map((charge) => (
            <label
                                            key= { charge.id }
                                            className = {`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${data.delivery_charge_id ===
                charge.id.toString()
                ? "border-gray-800 bg-gray-50 ring-1 ring-gray-800"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
        >
        <input
                                                type="radio"
name = "delivery_charge"
value = { charge.id }
checked = {
    data.delivery_charge_id ===
        charge.id.toString()
}
onChange = {() =>
handleDeliveryChange(charge)
                                                }
className = "h-5 w-5 text-gray-900 border-gray-300 focus:ring-gray-900"
    />
    <div className="ml-4 flex-1" >
        <div className="flex items-center justify-between" >
            <span className="block text-sm font-medium text-gray-900" >
                { charge.name }
                </span>
                < span className = "block text-sm font-bold text-gray-900" >
                                                        ৳{ charge.cost }
</span>
    </div>
    < span className = "block text-xs text-gray-500 mt-0.5" >
        ({ charge.duration })
        </span>
        </div>
        </label>
                                    ))}
</div>
{
    errors.delivery_charge_id && (
        <p className="text-red-500 text-sm mt-2" >
            Please select a delivery method
                </p>
                                )
}
</div>
    </div>

{/* Right Column: Order Summary */ }
<div className="lg:col-span-5" >
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6" >
        <div className="flex items-center justify-between mb-6" >
            <h2 className="text-lg font-bold text-gray-900" >
                Your order
                    </h2>
                    < div className = "text-sm text-gray-500" >
                        Items: { " " }
<span className="font-medium text-gray-900" >
    { cartItems.length }
    </span>{" "}
Quantity: { " " }
<span className="font-medium text-gray-900" >
{
    cartItems.reduce(
        (acc, item) =>
            acc + item.quantity,
        0
    )
}
    </span>
    </div>
    </div>

{/* Product List */ }
<div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar" >
    {
        cartItems.map((item) => (
            <div
                                            key= { item.product_id }
                                            className = "flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
            >
            {/* Product Image */ }
            < div className = "w-20 h-20 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden" >
            {
                item.image ? (
                    <img
                                                        src= {`/storage/${item.image}`}
                                                        alt = { item.name }
                                                        className = "w-full h-full object-cover"
            />
                                                ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100" >
            <span className="text-xs" >
            No Img
            </span>
            </div>
            )}
</div>

{/* Product Details */ }
<div className="flex-1 flex flex-col justify-between" >
    <div>
    <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug" >
        { item.name }
        </h4>
        < p className = "text-xs text-gray-500 mt-1" >
                                                        ৳{ item.price } x{ " " }
{ item.quantity } pcs
    </p>
    </div>

    < div className = "flex items-center justify-between mt-2" >
        <span className="text-sm font-bold text-gray-900" >
                                                        ৳
{
    item.price *
        item.quantity
}
</span>

{/* Quantity Controls */ }
<div className="flex items-center gap-3" >
    <button
                                                            onClick={
    (e) =>
        handleRemoveItem(
            e,
            item.product_id
        )
}
className = "p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
title = "Remove item"
type = "button"
    >
    <Trash2 className="w-4 h-4" />
        </button>

        < div className = "flex items-center border border-gray-200 rounded-full px-2 py-1 bg-white shadow-sm" >
            <button
                                                                onClick={
    (e) =>
        handleQuantityChange(
            e,
            item.product_id,
            item.quantity -
            1
        )
}
className = "p-1 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
disabled = {
    item.quantity <=
        1
}
type = "button"
    >
    <Minus className="w-3 h-3" />
        </button>
        < span className = "mx-2 text-xs font-medium w-4 text-center" >
            { item.quantity }
            </span>
            < button
onClick = {(e) =>
handleQuantityChange(
    e,
    item.product_id,
    item.quantity +
    1
)
                                                                }
className = "p-1 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
type = "button"
    >
    <Plus className="w-3 h-3" />
        </button>
        </div>
        </div>
        </div>
        </div>
        </div>
                                    ))}
</div>

{/* Totals */ }
<div className="space-y-3 pt-4 border-t border-gray-100" >
    <div className="flex justify-between text-sm text-gray-600" >
        <span>Product Total </span>
            < span className = "font-semibold text-gray-900" >
                                            ৳{ cartTotal }
</span>
    </div>
    < div className = "flex justify-between text-sm text-gray-600" >
        <span>Delivery Charge </span>
            < span className = "font-semibold text-gray-900" >
                                            ৳
{
    selectedDelivery
        ? Number(selectedDelivery.cost)
        : 0
}
</span>
    </div>
    < div className = "flex justify-between text-sm text-gray-600" >
        <span>Discount </span>
        < span className = "font-semibold text-gray-900" >
                                            ৳0
    </span>
    </div>

    < div className = "pt-4 mt-2 border-t border-gray-100" >
        <div className="flex justify-between items-end" >
            <span className="text-base font-bold text-gray-900" >
                Final Total
                    </span>
                    < span className = "text-2xl font-bold text-gray-900" >
                                                ৳{ total }
</span>
    </div>
    </div>
    </div>

{/* Submit Button */ }
<button
                                    type="submit"
form = "checkout-form"
disabled = { processing }
className = "w-full mt-6 bg-[#1A1A1A] text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
    >
{
    processing?(
                                        <>
    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Processing...
</>
                                    ) : (
    <>
    Place order
        < svg
className = "w-5 h-5"
fill = "none"
viewBox = "0 0 24 24"
stroke = "currentColor"
    >
    <path
                                                    strokeLinecap="round"
strokeLinejoin = "round"
strokeWidth = { 2}
d = "M14 5l7 7m0 0l-7 7m7-7H3"
    />
    </svg>
    </>
                                    )}
</button>
    </div>
    </div>
    </div>
    </div>
    </div>
    </CustomerLayout>
    );
}
