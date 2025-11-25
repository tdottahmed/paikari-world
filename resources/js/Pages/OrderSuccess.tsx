import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Order } from "@/types";

interface OrderSuccessProps {
    order: Order;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
    return (
        <CustomerLayout>
            <Head title="Order Success" />
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="bg-green-100 text-green-700 p-4 rounded-full inline-block mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4"> Thank You! </h1>
                <p className="text-xl mb-8">
                    {" "}
                    Your order has been placed successfully.
                </p>
                <div className="bg-gray-100 p-6 rounded-lg max-w-md mx-auto mb-8 text-left">
                    <p className="mb-2">
                        {" "}
                        <strong>Order ID: </strong> #{order.id}
                    </p>
                    <p className="mb-2">
                        {" "}
                        <strong>Total Amount: </strong> ৳{order.total}
                    </p>
                    <p className="mb-2">
                        {" "}
                        <strong>Status: </strong> {order.status}
                    </p>
                </div>
                <Link
                    href={route("home")}
                    className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition font-semibold"
                >
                    Continue Shopping
                </Link>
            </div>
        </CustomerLayout>
    );
}
