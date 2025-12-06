import { Head, Link, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import { Order, PageProps } from "@/types";
import {
    ArrowLeft,
    Printer,
    Package,
    User,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    TrendingUp,
    Shield,
    AlertTriangle,
} from "lucide-react";
import Card, { CardContent } from "@/Components/Ui/Card";
import { format } from "date-fns";
import { useState } from "react";
import ConfirmModal from "@/Components/Ui/ConfirmModal";
import { formatPrice } from "@/Utils/helpers";

interface Props extends PageProps {
    order: Order;
}

export default function Show({ order }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fraudData, setFraudData] = useState<any>(null);
    const [isLoadingFraudCheck, setIsLoadingFraudCheck] = useState(false);

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "processing":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "shipped":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "delivered":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelled":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setSelectedStatus(newStatus);
        setShowConfirmModal(true);
    };

    const handleConfirmStatusChange = () => {
        setIsUpdating(true);
        router.post(
            route("admin.orders.update-status", order.id),
            { status: selectedStatus },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsUpdating(false);
                    setShowConfirmModal(false);
                },
            }
        );
    };

    const handleCheckFraud = async () => {
        setIsLoadingFraudCheck(true);
        try {
            const response = await fetch(route("admin.orders.check-fraud", order.id));
            const data = await response.json();
            setFraudData(data);
        } catch (error) {
            console.error("Error checking fraud status:", error);
        } finally {
            setIsLoadingFraudCheck(false);
        }
    };

    const calculateProfit = () => {
        return (
            order.items?.reduce((total, item) => {
                const cost = item.product?.purchase_price || 0;
                return total + (item.price - cost) * item.quantity;
            }, 0) || 0
        );
    };

    const profit = calculateProfit();

    return (
        <Master>
        <Head title= {`Order #${order.id}`
} />

    < div className = "p-4 md:p-6 space-y-6 pb-24 min-h-screen bg-[#0C1311]" >
        {/* Header */ }
        < div className = "flex flex-col md:flex-row md:items-center justify-between gap-4" >
            <div className="flex items-center gap-4" >
                <Link
                            href={ route("admin.orders.index") }
className = "p-2 rounded-lg bg-[#1E2826] text-gray-400 hover:text-white hover:bg-[#2A3633] transition-colors"
    >
    <ArrowLeft className="w-5 h-5" />
        </Link>
        < div >
        <div className="flex items-center gap-3" >
            <h1 className="text-2xl font-bold text-white" >
                Order #{ order.id }
</h1>
    < span
className = {`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
    order.status
)}`}
                                >
    { order.status }
    </span>
    </div>
    < p className = "text-gray-400 text-sm mt-1" >
        {
            format(
                                    new Date(order.created_at),
        "MMMM d, yyyy 'at' h:mm a"
                                )}
</p>
    </div>
    </div>

    < a
href = { route("admin.orders.invoice", order.id) }
target = "_blank"
className = "flex items-center justify-center gap-2 px-4 py-2 bg-[#2DE3A7] text-[#0C1311] rounded-lg font-semibold text-sm hover:bg-[#26c28f] transition-colors"
    >
    <Printer className="w-4 h-4" />
        <span>Print Invoice </span>
            </a>
            </div>

{/* Summary Cards */ }
<div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
    {/* Total Amount */ }
    < Card className = "bg-[#0E1614] border-[#1E2826]" >
        <CardContent className="p-6" >
            <div className="flex items-center gap-4" >
                <div className="p-3 bg-[#2DE3A7]/10 rounded-lg" >
                    <DollarSign className="w-6 h-6 text-[#2DE3A7]" />
                        </div>
                        < div className = "flex-1" >
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1" >
                                Order Total
                                    </div>
                                    < div className = "text-2xl font-bold text-white" >
                                        { formatPrice(order.total) }
                                        </div>
                                        </div>
                                        </div>
                                        </CardContent>
                                        </Card>

{/* Profit */ }
<Card className="bg-[#0E1614] border-[#1E2826]" >
    <CardContent className="p-6" >
        <div className="flex items-center gap-4" >
            <div className="p-3 bg-green-500/10 rounded-lg" >
                <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    < div className = "flex-1" >
                        <div className="text-sm text-gray-400 uppercase tracking-wider mb-1" >
                            Profit
                            </div>
                            < div className = "text-2xl font-bold text-green-400" >
                                { formatPrice(profit) }
                                </div>
                                </div>
                                </div>
                                </CardContent>
                                </Card>

{/* Items Count */ }
<Card className="bg-[#0E1614] border-[#1E2826]" >
    <CardContent className="p-6" >
        <div className="flex items-center gap-4" >
            <div className="p-3 bg-blue-500/10 rounded-lg" >
                <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    < div className = "flex-1" >
                        <div className="text-sm text-gray-400 uppercase tracking-wider mb-1" >
                            Items
                            </div>
                            < div className = "text-2xl font-bold text-white" >
                            {
                                order.items?.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                ) || 0
                            }
                                </div>
                                </div>
                                </div>
                                </CardContent>
                                </Card>
                                </div>

{/* Main Content Grid */ }
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
    {/* Left Column - Customer & Delivery Info */ }
    < div className = "lg:col-span-1 space-y-6" >
        {/* Customer Information */ }
        < Card className = "bg-[#0E1614] border-[#1E2826]" >
            <CardContent className="p-6" >
                <div className="flex items-center gap-2 mb-4" >
                    <User className="w-5 h-5 text-[#2DE3A7]" />
                        <h3 className="text-lg font-bold text-white" >
                            Customer Details
                                </h3>
                                </div>
                                < div className = "space-y-4" >
                                    <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1" >
                                        Name
                                        </div>
                                        < div className = "text-white font-medium" >
                                            { order.customer_name || "Guest" }
                                            </div>
                                            </div>
                                            < div >
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1" >
                                                <Phone className="w-3 h-3" />
                                                    Phone
                                                    </div>
                                                    < div className = "text-white font-medium" >
                                                        { order.customer_phone }
                                                        </div>
                                                        </div>
                                                        < div >
                                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1" >
                                                            <MapPin className="w-3 h-3" />
                                                                Address
                                                                </div>
                                                                < div className = "text-white text-sm leading-relaxed" >
                                                                    { order.customer_address }
                                                                    </div>
                                                                    </div>
                                                                    </div>

{/* Fraud Check Section */ }
<div className="pt-4 border-t border-[#1E2826]" >
    <div className="flex items-center justify-between mb-2" >
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2" >
            <Shield className="w-4 h-4 text-[#2DE3A7]" />
                Fraud Check
                    </h4>
{
    !fraudData && (
        <button
                                                                                    onClick={ handleCheckFraud }
    disabled = { isLoadingFraudCheck }
    className = "text-xs px-2 py-1 bg-[#2DE3A7]/10 text-[#2DE3A7] rounded hover:bg-[#2DE3A7]/20 transition-colors disabled:opacity-50"
        >
        { isLoadingFraudCheck? "Checking...": "Check Status" }
        </button>
                                                                            )
}
</div>

{
    fraudData && (
        <div className="space-y-2 text-sm" >
            <div className="flex justify-between items-center" >
                <span className="text-gray-500" > Success Ratio </span>
                    < span className = {`font-bold ${fraudData.success_ratio >= 80 ? "text-green-500" :
                        fraudData.success_ratio >= 50 ? "text-yellow-500" : "text-red-500"
                        }`
}>
    { fraudData.success_ratio } %
    </span>
    </div>
    < div className = "flex justify-between items-center" >
        <span className="text-gray-500" > Total Orders </span>
            < span className = "text-white" > { fraudData.total_orders } </span>
                </div>
                < div className = "flex justify-between items-center" >
                    <span className="text-gray-500" > Cancelled </span>
                        < span className = "text-red-400" > { fraudData.cancel_orders } </span>
                            </div>
                            < div className = "text-xs text-gray-600 mt-1 text-right" >
                                Last checked: { format(new Date(fraudData.last_checked_at), "MMM d, h:mm a") }
</div>
    </div>
                                                                        )}
</div>
    </CardContent>
    </Card>

{/* Delivery Information */ }
<Card className="bg-[#0E1614] border-[#1E2826]" >
    <CardContent className="p-6" >
        <div className="flex items-center gap-2 mb-4" >
            <Package className="w-5 h-5 text-[#2DE3A7]" />
                <h3 className="text-lg font-bold text-white" >
                    Delivery Info
                        </h3>
                        </div>
                        < div className = "space-y-4" >
                            <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1" >
                                Method
                                </div>
                                < div className = "text-white font-medium" >
                                {
                                    order.delivery_charge?.name ||
                                        "Standard Delivery"
                                }
                                    </div>
                                    </div>
                                    < div >
                                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1" >
                                        Charge
                                        </div>
                                        < div className = "text-white font-medium" >
                                            { formatPrice(order.delivery_cost) }
                                            </div>
                                            </div>
{
    order.delivery_charge?.duration && (
        <div>
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1" >
            <Calendar className="w-3 h-3" />
                Duration
                </div>
                < div className = "text-white text-sm" >
                    { order.delivery_charge.duration }
                    </div>
                    </div>
                                    )
}
</div>
    </CardContent>
    </Card>

{/* Status Update */ }
<Card className="bg-[#0E1614] border-[#1E2826]" >
    <CardContent className="p-6" >
        <h3 className="text-lg font-bold text-white mb-4" >
            Update Status
                </h3>
                < div className = "space-y-2" >
                {
                    statusOptions.map((option) => (
                        <button
                                            key= { option.value }
                                            onClick = {() =>
                        handleStatusChange(option.value)
                                            }
disabled = {
    isUpdating ||
    order.status === option.value
                                            }
className = {`w-full text-left px-4 py-3 rounded-lg border transition-all ${order.status === option.value
    ? getStatusColor(
        option.value
    ) + " font-semibold"
    : "bg-[#1E2826] border-[#2A3633] text-gray-300 hover:bg-[#2A3633] hover:border-[#2DE3A7]/30"
    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
    { option.label }
{
    order.status === option.value && (
        <span className="ml-2 text-xs" >
            (Current)
            </span>
                                            )
}
</button>
                                    ))}
</div>
    </CardContent>
    </Card>
    </div>

{/* Right Column - Order Items */ }
<div className="lg:col-span-2" >
    <Card className="bg-[#0E1614] border-[#1E2826]" >
        <CardContent className="p-6" >
            <h3 className="text-lg font-bold text-white mb-6" >
                Order Items
                    </h3>

{/* Items Table */ }
<div className="overflow-x-auto" >
    <table className="w-full" >
        <thead>
        <tr className="border-b border-[#1E2826]" >
            <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" >
                Product
                </th>
                < th className = "text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" >
                    Price
                    </th>
                    < th className = "text-center py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" >
                        Qty
                        </th>
                        < th className = "text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" >
                            Total
                            </th>
                            < th className = "text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider" >
                                Profit
                                </th>
                                </tr>
                                </thead>
                                <tbody>
{
    order.items?.map((item, idx) => {
        const itemProfit =
            (item.price -
                (item.product
                    ?.purchase_price ||
                    0)) *
            item.quantity;
        return (
            <tr
                                                        key= { idx }
        className = "border-b border-[#1E2826] hover:bg-[#1E2826]/50 transition-colors"
            >
            <td className="py-4 px-2" >
                <div className="flex items-center gap-3" >
                {
                    item.product
                        ?.images?.[0] && (
                            <img
                                                                        src={ `/storage/${item.product.images[0]}` }
        alt = {
            item
                                                                                .product
                ?.name ||
                ""
        }
        className = "w-12 h-12 object-cover rounded-lg border border-[#2A3633]"
            />
                                                                )
}
<div>
    <div className="text-white font-medium text-sm" >
    {
        item
                                                                            .product
            ?.name ||
            "Unknown Product"
    }
        </div>
{
    item
        .product
        ?.sku && (
            <div className="text-xs text-gray-500" >
                SKU: { " " }
    {
        item
            .product
            .sku
    }
    </div>
                                                                    )
}
</div>
    </div>
    </td>
    < td className = "py-4 px-2 text-right text-white" >
        { formatPrice(item.price) }
        </td>
        < td className = "py-4 px-2 text-center" >
            <span className="inline-block px-3 py-1 bg-[#1E2826] text-white rounded-full text-sm font-medium" >
                { item.quantity }
                </span>
                </td>
                < td className = "py-4 px-2 text-right text-white font-semibold" >
                    { formatPrice(item.price * item.quantity) }
                    </td>
                    < td className = "py-4 px-2 text-right text-green-400 font-semibold" >
                        { formatPrice(itemProfit) }
                        </td>
                        </tr>
                                                );
                                            })}
</tbody>
    </table>
    </div>

{/* Price Breakdown */ }
<div className="mt-6 pt-6 border-t border-[#1E2826]" >
    <div className="max-w-md ml-auto space-y-3" >
        <div className="flex justify-between text-gray-400" >
            <span>Subtotal </span>
            < span className = "text-white font-medium" >
                { formatPrice(order.subtotal) }
                </span>
                </div>
                < div className = "flex justify-between text-gray-400" >
                    <span>Delivery Charge </span>
                        < span className = "text-white font-medium" >
                            { formatPrice(order.delivery_cost) }
                            </span>
                            </div>
                            < div className = "flex justify-between text-lg font-bold pt-3 border-t border-[#1E2826]" >
                                <span className="text-white" >
                                    Total
                                    </span>
                                    < span className = "text-[#2DE3A7]" >
                                        { formatPrice(order.total) }
                                        </span>
                                        </div>
                                        < div className = "flex justify-between text-lg font-bold" >
                                            <span className="text-white" >
                                                Profit
                                                </span>
                                                < span className = "text-green-400" >
                                                    { formatPrice(profit) }
                                                    </span>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </CardContent>
                                                    </Card>
                                                    </div>
                                                    </div>
                                                    </div>

{/* Confirm Modal */ }
<ConfirmModal
                isOpen={ showConfirmModal }
onClose = {() => setShowConfirmModal(false)}
onConfirm = { handleConfirmStatusChange }
title = "Change Order Status"
message = {`Are you sure you want to change the order status to "${selectedStatus}"? This action will update the order immediately.`}
confirmText = "Change Status"
cancelText = "Cancel"
variant = "warning"
isLoading = { isUpdating }
    />
    </Master>
    );
}
