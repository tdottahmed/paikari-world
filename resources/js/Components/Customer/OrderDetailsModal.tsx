import { X } from "lucide-react";
import { formatPrice, formatDate, storagePath } from "@/Utils/helpers";
import Image from "../Ui/Image";

interface OrderItem {
    id: number;
    product: {
        name: string;
        images: string[];
    };
    quantity: number;
    price: number;
}

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
    items: OrderItem[];
}

interface OrderDetailsModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

const OrderDetailsModal = ({
    order,
    isOpen,
    onClose,
}: OrderDetailsModalProps) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {formatDate(order.created_at)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                            {" "}
                            Status:{" "}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium capitalize
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

                    {/* Items List */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900"> Items </h4>
                        <div className="space-y-3">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <Image
                                            src={
                                                item.product.images &&
                                                item.product.images.length > 0
                                                    ? storagePath(
                                                          item.product.images[0]
                                                      )
                                                    : undefined
                                            }
                                            alt={item.product.name || ""}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-sm font-medium text-gray-900 truncate">
                                            {item.product.name}
                                        </h5>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity} ×{" "}
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatPrice(
                                            item.price * item.quantity
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900">
                                {" "}
                                Delivery Details{" "}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <span className="font-medium"> Name: </span>{" "}
                                    {order.customer_name}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        {" "}
                                        Phone:{" "}
                                    </span>{" "}
                                    {order.customer_phone}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        {" "}
                                        Address:{" "}
                                    </span>{" "}
                                    {order.customer_address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer / Totals */}
                <div className="p-6 border-t bg-gray-50 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal </span>
                        <span> {formatPrice(order.subtotal)} </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery </span>
                        <span> {formatPrice(order.delivery_cost)} </span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                        <span>Total </span>
                        <span> {formatPrice(order.total)} </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
