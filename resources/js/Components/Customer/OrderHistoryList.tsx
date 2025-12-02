import { useEffect, useState } from "react";
import axios from "axios";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import { formatPrice, formatDate } from "@/Utils/helpers";
import OrderDetailsModal from "./OrderDetailsModal";

interface Order {
    id: number;
    created_at: string;
    status: string;
    total: number;
    subtotal: number;
    delivery_cost: number;
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    items: any[];
}

const OrderHistoryList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Get order IDs from cookie
                const cookies = document.cookie.split(";");
                const guestOrdersCookie = cookies.find((c) =>
                    c.trim().startsWith("guest_orders=")
                );

                if (!guestOrdersCookie) {
                    setLoading(false);
                    return;
                }

                const orderIds = JSON.parse(
                    decodeURIComponent(guestOrdersCookie.split("=")[1])
                );

                if (orderIds && orderIds.length > 0) {
                    const response = await axios.post(
                        route("api.orders.history"),
                        {
                            order_ids: orderIds,
                        }
                    );
                    setOrders(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch order history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading history...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
                <Package size={48} className="opacity-50" />
                <p className="text-lg font-medium"> No order history </p>
                <p className="text-sm text-center px-8">
                    Orders you place will appear here.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 p-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-medium text-gray-500">
                                    {" "}
                                    Order #{order.id}{" "}
                                </span>
                                <p className="text-sm font-bold text-gray-900">
                                    {" "}
                                    {formatDate(order.created_at)}{" "}
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                ${
                                    order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : order.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="font-bold text-gray-900">
                                {" "}
                                {formatPrice(order.total)}{" "}
                            </span>
                            <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Details <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </>
    );
};

export default OrderHistoryList;
