import React from "react";
import { Order } from "@/types";
import Card, { CardContent } from "@/Components/Ui/Card";
import Checkbox from "@/Components/Ui/Checkbox";
import SelectInput from "@/Components/Ui/SelectInput";
import { FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";

interface Props {
    order: Order;
    selected: boolean;
    onSelect: () => void;
    onStatusChange: (order: Order, status: string) => void;
    statusOptions: { value: string; label: string }[];
    getStatusColor: (status: string) => string;
}

export default function OrderGridItem({
    order,
    selected,
    onSelect,
    onStatusChange,
    statusOptions,
    getStatusColor,
}: Props) {
    return (
        <Card
            className= {`relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2DE3A7]/10 ${selected ? "border-[#2DE3A7] ring-1 ring-[#2DE3A7]/20" : ""
            }`
}
padding = "none"
    >
    <div className="absolute top-4 left-4 z-10" >
        <Checkbox
                    name={ `order-${order.id}` }
checked = { selected }
onChange = { onSelect }
    />
    </div>

    < CardContent className = "space-y-4 p-5" >
        {/* Header */ }
        < div className = "flex justify-between items-start pl-8" >
            <div>
            <div className="flex items-center gap-2" >
                <span className="text-lg font-bold text-white" >
                                #{ order.id } { " " }
</span>
    < span
className = {`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
    order.status
)
    .replace("bg-", "bg-opacity-10 bg-")
    .replace(
        "border-",
        "border border-opacity-20 "
    )}`}
                            >
    { order.status }
    </span>
    </div>
    < div className = "text-xs text-gray-500 mt-1" >
        {
            format(
                                new Date(order.created_at),
        "MMM d, h:mm a"
                            )}
</div>
    </div>
    < div className = "text-right" >
        <div className="text-lg font-bold text-[#2DE3A7]" >
                            ৳{ order.total } { " " }
</div>
    < div className = "text-xs text-gray-500" >
        { " "}
{ order.items?.length || 0 } Items{ " " }
</div>
    </div>
    </div>

{/* Customer Info */ }
<div className="bg-[#0C1311] rounded-lg p-3 border border-[#1E2826]" >
    <div className="flex justify-between items-center mb-1" >
        <span className="text-xs text-gray-500" >
            { " "}
                            Customer{ " " }
</span>
    < span className = "text-sm font-medium text-gray-300" >
        { " "}
{ order.customer_name || "Guest" } { " " }
</span>
    </div>
    < div className = "flex justify-between items-center" >
        <span className="text-xs text-gray-500" > Phone </span>
            < span className = "text-sm text-gray-400" >
                { " "}
{ order.customer_phone } { " " }
</span>
    </div>
    </div>

{/* Actions */ }
<div className="space-y-3 pt-2" >
    <SelectInput
                        value={ order.status }
options = { statusOptions }
onChange = {(val) => onStatusChange(order, val)}
className = "w-full"
    />

    <div className="grid grid-cols-2 gap-2" >
        <a
                            href={ route("admin.orders.invoice", order.id) }
target = "_blank"
className = "flex items-center justify-center gap-2 px-3 py-2 bg-[#1E2826] text-gray-300 rounded-lg text-sm hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
    >
    <FileText className="w-4 h-4" />
        Invoice
        </a>
        < button className = "flex items-center justify-center gap-2 px-3 py-2 bg-[#1E2826] text-gray-300 rounded-lg text-sm hover:bg-[#2A3633] transition-colors border border-[#2A3633]" >
            <Eye className="w-4 h-4" />
                Details
                </button>
                </div>
                </div>
                </CardContent>
                </Card>
    );
}
