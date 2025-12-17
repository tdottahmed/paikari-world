import React from "react";
import { Head } from "@inertiajs/react";
import { Order } from "@/types";
import { format } from "date-fns";
import { getAssetUrl } from "@/Utils/helpers";

interface Props {
    order: Order;
}

export default function Invoice({ order }: Props) {
    return (
        <div className="bg-white min-h-screen p-8 text-gray-900">
            <Head title={`Invoice #${order.id}`} />

            <div className="max-w-4xl mx-auto border border-gray-200 p-8 shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {" "}
                            INVOICE{" "}
                        </h1>
                        <p className="text-gray-500">#{order.id} </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold"> Paikari World </h2>
                        <p className="text-sm text-gray-600">
                            {" "}
                            123 Business Street{" "}
                        </p>
                        <p className="text-sm text-gray-600">
                            {" "}
                            Dhaka, Bangladesh{" "}
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="flex justify-between mb-8">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">
                            {" "}
                            Bill To:{" "}
                        </h3>
                        <p> {order.customer_name || "Guest"} </p>
                        <p> {order.customer_phone} </p>
                        <p className="max-w-xs"> {order.customer_address} </p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-bold text-gray-700 mb-2">
                            {" "}
                            Order Details:{" "}
                        </h3>
                        <p>
                            {" "}
                            Date: {format(
                                new Date(order.created_at),
                                "PPP"
                            )}{" "}
                        </p>
                        <p> Status: {order.status} </p>
                    </div>
                </div>

                {/* Items */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-2"> Image </th>
                            <th className="text-left py-2"> Item </th>
                            <th className="text-center py-2"> Quantity </th>
                            <th className="text-right py-2"> Price </th>
                            <th className="text-right py-2"> Total </th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-gray-100"
                            >
                                <td className="py-2">
                                    {item.product?.images &&
                                        item.product.images.length > 0 && (
                                            <img
                                                src={getAssetUrl(
                                                    item.product.images[0]
                                                )}
                                                alt={item.product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                </td>
                                <td className="py-2">
                                    {" "}
                                    {item.product?.name || "Product"}{" "}
                                </td>
                                <td className="text-center py-2">
                                    {" "}
                                    {item.quantity}{" "}
                                </td>
                                <td className="text-right py-2">
                                    ৳{item.price}{" "}
                                </td>
                                <td className="text-right py-2">
                                    ৳{item.price * item.quantity}{" "}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal: </span>
                            <span>৳{order.subtotal} </span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Delivery: </span>
                            <span>৳{order.delivery_cost} </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                            <span>Total: </span>
                            <span>৳{order.total} </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-gray-500 text-sm">
                    <p>Thank you for your business! </p>
                </div>
            </div>
        </div>
    );
}
