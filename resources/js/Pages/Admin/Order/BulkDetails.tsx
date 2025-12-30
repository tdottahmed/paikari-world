import { Head, Link } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import { Order, PageProps } from "@/types";
import {
    ArrowLeft,
    Printer,
    DollarSign,
    TrendingUp,
    Package,
    Eye,
    Calendar,
    User,
    Phone,
    MapPin,
} from "lucide-react";
import Card, { CardContent } from "@/Components/Ui/Card";
import { format } from "date-fns";
import { formatPrice } from "@/Utils/helpers";

interface Props extends PageProps {
    orders: Order[];
}

export default function BulkDetails({ orders }: Props) {
    const totalAmount = orders.reduce((sum, o) => sum + o.total, 0) || 0;
    const totalItems = orders.reduce(
        (sum, o) => sum + (o.items?.reduce((s, i) => s + i.quantity, 0) || 0),
        0
    );
    const totalProfit = orders.reduce((sum, o) => {
        const orderProfit =
            o.items?.reduce((p, item) => {
                const cost = item.product?.purchase_price || 0;
                return p + (item.price - cost) * item.quantity;
            }, 0) || 0;
        return sum + orderProfit;
    }, 0);

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

    return (
        <Master>
        <Head title= "Bulk Order Details" />

        <div className="p-4 md:p-6 space-y-6 pb-24 min-h-screen bg-[#0C1311]" >
            {/* Header */ }
            < div className = "flex flex-col md:flex-row md:items-center justify-between gap-4" >
                <div className="flex items-center gap-4" >
                    <Link
                            href={ route("admin.orders.index") }
    className = "p-2.5 rounded-xl bg-[#1E2826] text-gray-400 hover:text-white hover:bg-[#2A3633] transition-all hover:scale-105"
        >
        <ArrowLeft className="w-5 h-5" />
            </Link>
            < div >
            <h1 className="text-2xl md:text-3xl font-bold text-white" >
                Selected Orders
                    </h1>
                    < p className = "text-gray-400 text-sm mt-1" >
                        Viewing details for{ " "}
                            < span className = "text-[#2DE3A7] font-semibold" >
                            { orders.length }
                            </span>{" "}
                                { orders.length === 1 ? "order" : "orders" }
        </p>
        </div>
        </div>

        < a
                        href = {
            route("admin.orders.bulk-invoice", {
                ids: orders.map((o) => o.id).join(","),
        })
}
target = "_blank"
className = "flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2DE3A7] text-[#0C1311] rounded-xl font-semibold text-sm hover:bg-[#26c28f] transition-all hover:scale-105 shadow-lg shadow-[#2DE3A7]/20"
    >
    <Printer className="w-4 h-4" />
        <span>Print All Invoices </span>
            </a>
            </div>

{/* Analytics Cards */ }
<div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
    {/* Total Amount */ }
    < Card className = "bg-gradient-to-br from-[#0E1614] to-[#0C1311] border-[#1E2826] hover:border-[#2DE3A7]/30 transition-all hover:scale-[1.02]" >
        <CardContent className="p-6" >
            <div className="flex items-start justify-between mb-4" >
                <div className="p-3 bg-[#2DE3A7]/10 rounded-xl" >
                    <DollarSign className="w-6 h-6 text-[#2DE3A7]" />
                        </div>
                        < div className = "text-right" >
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1" >
                                Total Amount
                                    </div>
                                    < div className = "text-2xl md:text-3xl font-bold text-white" >
                                        { formatPrice(totalAmount) }
                                        </div>
                                        </div>
                                        </div>
                                        < div className = "text-xs text-gray-400" >
                                            Combined revenue from all orders
                                                </div>
                                                </CardContent>
                                                </Card>

{/* Total Profit */ }
<Card className="bg-gradient-to-br from-[#0E1614] to-[#0C1311] border-[#1E2826] hover:border-green-500/30 transition-all hover:scale-[1.02]" >
    <CardContent className="p-6" >
        <div className="flex items-start justify-between mb-4" >
            <div className="p-3 bg-green-500/10 rounded-xl" >
                <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    < div className = "text-right" >
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1" >
                            Total Profit
                                </div>
                                < div className = "text-2xl md:text-3xl font-bold text-green-400" >
                                    { formatPrice(totalProfit) }
                                    </div>
                                    </div>
                                    </div>
                                    < div className = "text-xs text-gray-400" >
                                        Estimated profit margin
                                            </div>
                                            </CardContent>
                                            </Card>

{/* Total Items */ }
<Card className="bg-gradient-to-br from-[#0E1614] to-[#0C1311] border-[#1E2826] hover:border-blue-500/30 transition-all hover:scale-[1.02]" >
    <CardContent className="p-6" >
        <div className="flex items-start justify-between mb-4" >
            <div className="p-3 bg-blue-500/10 rounded-xl" >
                <Package className="w-6 h-6 text-blue-400" />
                    </div>
                    < div className = "text-right" >
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1" >
                            Total Items
                                </div>
                                < div className = "text-2xl md:text-3xl font-bold text-white" >
                                    { totalItems.toLocaleString() }
                                    </div>
                                    </div>
                                    </div>
                                    < div className = "text-xs text-gray-400" >
                                        Total products across all orders
                                            </div>
                                            </CardContent>
                                            </Card>
                                            </div>

{/* Orders List */ }
<div className="space-y-4" >
    <div className="flex items-center justify-between" >
        <h2 className="text-xl font-bold text-white" >
            Order Details
                </h2>
                < div className = "text-sm text-gray-400" >
                    { orders.length }{ " " }
{ orders.length === 1 ? "order" : "orders" }
</div>
    </div>

{
    orders.map((order) => (
        <Card
                            key= { order.id }
                            className = "bg-[#0E1614] border-[#1E2826] hover:border-[#2DE3A7]/30 transition-all overflow-hidden"
        >
        <CardContent className="p-0" >
        {/* Order Header */ }
    < div className = "p-4 md:p-6 bg-gradient-to-r from-[#1E2826]/50 to-transparent border-b border-[#1E2826]" >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" >
    <div className="flex items-center gap-4" >
    <div className="flex flex-col" >
    <div className="flex items-center gap-3 mb-2" >
    <span className="text-lg font-bold text-white" >
    Order #{ order.id }
    </span>
    < span
                                                        className = {`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
        order.status
    )}`}
                                                    >
    { order.status }
    </span>
    </div>
    < div className = "flex items-center gap-2 text-sm text-gray-400" >
        <Calendar className="w-4 h-4" />
            {
                format(
                                                        new Date(
                    order.created_at
                ),
            "MMM d, yyyy 'at' h:mm a"
                                                    )}
</div>
    </div>
    </div>
    < div className = "flex items-center gap-3" >
        <div className="text-right" >
            <div className="text-2xl font-bold text-[#2DE3A7]" >
                { formatPrice(order.total) }
                </div>
                < div className = "text-sm text-gray-400" >
                    { order.items?.length || 0 }{ " " }
{
    order.items?.length === 1
    ? "item"
    : "items"
}
</div>
    </div>
    < Link
href = {
    route(
                                                    "admin.orders.show",
        order.id
                                                )
}
className = "p-2.5 bg-[#1E2826] text-gray-300 rounded-lg hover:bg-[#2A3633] hover:text-white transition-all hover:scale-105"
title = "View Details"
    >
    <Eye className="w-4 h-4" />
        </Link>
        </div>
        </div>
        </div>

{/* Order Content */ }
<div className="p-4 md:p-6" >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
        {/* Customer Details */ }
        < div className = "space-y-4" >
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2" >
                <User className="w-4 h-4 text-[#2DE3A7]" />
                    Customer Information
                        </h3>
                        < div className = "space-y-3 pl-6" >
                            <div className="flex items-start gap-3" >
                                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                                    <div className="flex-1" >
                                        <div className="text-xs text-gray-500 mb-0.5" >
                                            Name
                                            </div>
                                            < div className = "text-white font-medium" >
                                            {
                                                order.customer_name ||
                                                    "Guest"
                                            }
                                                </div>
                                                </div>
                                                </div>
                                                < div className = "flex items-start gap-3" >
                                                    <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                                                        <div className="flex-1" >
                                                            <div className="text-xs text-gray-500 mb-0.5" >
                                                                Phone
                                                                </div>
                                                                < div className = "text-white font-medium" >
                                                                {
                                                                    order.customer_phone
                                                                }
                                                                    </div>
                                                                    </div>
                                                                    </div>
{
    order.customer_address && (
        <div className="flex items-start gap-3" >
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="flex-1" >
                    <div className="text-xs text-gray-500 mb-0.5" >
                        Address
                        </div>
                        < div className = "text-white text-sm leading-relaxed" >
                        {
                            order.customer_address
                        }
                            </div>
                            </div>
                            </div>
                                                )
}
</div>
    </div>

{/* Order Items */ }
<div className="space-y-4" >
    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2" >
        <Package className="w-4 h-4 text-[#2DE3A7]" />
            Order Items
                </h3>
                < div className = "space-y-3" >
                {
                    order.items?.map(
                        (item, idx) => (
                            <div
                                                            key= { idx }
                                                            className = "flex items-center justify-between p-3 bg-[#1E2826]/30 rounded-lg border border-[#1E2826] hover:border-[#2DE3A7]/20 transition-colors"
                        >
                        <div className="flex-1 min-w-0" >
                    <div className="text-white font-medium text-sm truncate" >
                    {
                        item
                                                                        .product
                            ?.name ||
                            "Unknown Product"
                    }
                    </div>
                    {item.variation_ids && item.variation_ids.length > 0 && item.product?.product_variations && (
                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            {item.variation_ids.map((variationId) => {
                                const variation = item.product?.product_variations?.find(
                                    (v) => v.id === variationId
                                );
                                if (!variation) return null;
                                return (
                                    <div key={variationId}>
                                        <span className="font-medium text-gray-400">
                                            {variation.product_attribute?.name || "Option"}:
                                        </span>{" "}
                                        <span>{variation.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    < div className = "text-xs text-gray-500 mt-0.5" >
                    Qty: { " "}
                                                                    {
                            item.quantity
                        }{ " "}
                                                                    × { formatPrice(item.price)
                }
                    </div>
                    </div>
                    < div className = "text-white font-semibold text-sm ml-4" >
                        { formatPrice(item.price * item.quantity) }
                        </div>
                        </div>
                                                    )
                                                )}

{/* Price Summary */ }
<div className="pt-3 border-t border-[#1E2826] space-y-2" >
    <div className="flex justify-between text-sm" >
        <span className="text-gray-400" >
            Subtotal
            </span>
            < span className = "text-white font-medium" >
                { formatPrice(order.subtotal) }
                </span>
                </div>
                < div className = "flex justify-between text-sm" >
                    <span className="text-gray-400" >
                        Delivery
                        </span>
                        < span className = "text-white font-medium" >
                            { formatPrice(order.delivery_cost) }
                            </span>
                            </div>
                            < div className = "flex justify-between pt-2 border-t border-[#1E2826]" >
                                <span className="text-white font-bold" >
                                    Total
                                    </span>
                                    < span className = "text-[#2DE3A7] font-bold text-lg" >
                                        { formatPrice(order.total) }
                                        </span>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </div>
                                        </CardContent>
                                        </Card>
                    ))}
</div>
    </div>
    </Master>
    );
}
