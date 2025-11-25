import { Head, Link } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import { Order, PageProps } from "@/types";
import { ArrowLeft, Printer, FileText } from "lucide-react";
import Card, { CardContent } from "@/Components/Ui/Card";
import { format } from "date-fns";

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

    return (
        <Master>
            <Head title="Order Details" />

            <div className="p-4 md:p-6 space-y-6 pb-24 min-h-screen bg-[#0C1311]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.orders.index")}
                            className="p-2 rounded-lg bg-[#1E2826] text-gray-400 hover:text-white hover:bg-[#2A3633] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {" "}
                                Selected Orders{" "}
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {" "}
                                Viewing details for {orders.length} orders{" "}
                            </p>
                        </div>
                    </div>

                    <a
                        href={route("admin.orders.bulk-invoice", {
                            ids: orders.map((o) => o.id).join(","),
                        })}
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-[#2DE3A7] text-[#0C1311] rounded-lg font-semibold text-sm hover:bg-[#26c28f] transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print All </span>
                    </a>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-[#0E1614] border-[#1E2826]">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                {" "}
                                Total Amount{" "}
                            </div>
                            <div className="text-2xl font-bold text-[#2DE3A7]">
                                ৳{totalAmount.toLocaleString()}{" "}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0E1614] border-[#1E2826]">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                {" "}
                                Total Profit{" "}
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                                ৳{totalProfit.toLocaleString()}{" "}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-[#0E1614] border-[#1E2826]">
                        <CardContent className="p-6">
                            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                {" "}
                                Total Items{" "}
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {" "}
                                {totalItems}{" "}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card
                            key={order.id}
                            className="bg-[#0E1614] border-[#1E2826]"
                        >
                            <CardContent className="p-0">
                                <div className="p-4 md:p-6 border-b border-[#1E2826] flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-lg font-bold text-white">
                                                {" "}
                                                Order #{order.id}{" "}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-[#1E2826] text-gray-300 border border-[#2A3633]">
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {format(
                                                new Date(order.created_at),
                                                "MMMM d, yyyy h:mm a"
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-[#2DE3A7]">
                                            ৳{order.total}{" "}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {" "}
                                            {order.items?.length ||
                                                0} Items{" "}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Customer Details */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                                            {" "}
                                            Customer{" "}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    {" "}
                                                    Name{" "}
                                                </span>
                                                <span className="text-white font-medium">
                                                    {" "}
                                                    {order.customer_name ||
                                                        "Guest"}{" "}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">
                                                    {" "}
                                                    Phone{" "}
                                                </span>
                                                <span className="text-white">
                                                    {" "}
                                                    {order.customer_phone}{" "}
                                                </span>
                                            </div>
                                            {order.customer_address && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">
                                                        {" "}
                                                        Address{" "}
                                                    </span>
                                                    <span className="text-white text-right max-w-[200px]">
                                                        {" "}
                                                        {
                                                            order.customer_address
                                                        }{" "}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3">
                                            {" "}
                                            Items{" "}
                                        </h3>
                                        <div className="space-y-3">
                                            {order.items?.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-start"
                                                >
                                                    <div className="flex-1">
                                                        <div className="text-white font-medium text-sm">
                                                            {" "}
                                                            {item.product
                                                                ?.name ||
                                                                "Unknown Product"}{" "}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {" "}
                                                            Qty: {
                                                                item.quantity
                                                            }{" "}
                                                            × ৳{item.price}{" "}
                                                        </div>
                                                    </div>
                                                    <div className="text-white font-medium text-sm">
                                                        ৳
                                                        {item.price *
                                                            item.quantity}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-3 border-t border-[#1E2826] flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">
                                                    {" "}
                                                    Delivery Charge{" "}
                                                </span>
                                                <span className="text-white font-medium">
                                                    ৳{order.delivery_cost || 0}{" "}
                                                </span>
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
