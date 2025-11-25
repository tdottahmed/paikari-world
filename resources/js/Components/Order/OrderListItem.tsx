import React from "react";
import { Order } from "@/types";
import Checkbox from "@/Components/Ui/Checkbox";
import SelectInput from "@/Components/Ui/SelectInput";
import { FileText, Eye } from "lucide-react";
import { format } from "date-fns";

interface Props {
    order: Order;
    selected: boolean;
    onSelect: () => void;
    onStatusChange: (order: Order, status: string) => void;
    statusOptions: { value: string; label: string }[];
    getStatusColor: (status: string) => string;
}

export default function OrderListItem({
    order,
    selected,
    onSelect,
    onStatusChange,
    statusOptions,
    getStatusColor,
}: Props) {
    return (
        <div
            className= {`group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${selected
            ? "bg-[#0E1614] border-[#2DE3A7] ring-1 ring-[#2DE3A7]/20"
            : "bg-[#0E1614] border-[#1E2826] hover:border-[#2DE3A7]/50 hover:bg-[#131D1A]"
            }`
}
        >
    {/* Mobile Header: Checkbox, ID, Status */ }
    < div className = "flex items-center justify-between w-full md:w-auto md:justify-start gap-4 min-w-[120px]" >
        <div className="flex items-center gap-4" >
            <Checkbox
                        name={ `order-${order.id}` }
checked = { selected }
onChange = { onSelect }
    />
    <div className="flex flex-col" >
        <span className="text-white font-bold" >#{ order.id } </span>
            < span className = "text-xs text-gray-500 md:hidden" >
                { format(new Date(order.created_at), "MMM d, h:mm a")}
</span>
    </div>
    </div>

{/* Status Badge (Mobile Only) */ }
<div className="md:hidden" >
    <span
                        className={
    `px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${getStatusColor(
        order.status
    )
        .replace("bg-", "bg-opacity-10 bg-")
        .replace("border-", "border border-opacity-20 ")}`
}
                    >
    { order.status }
    </span>
    </div>
    </div>

{/* Date (Desktop) */ }
<div className="hidden md:block min-w-[140px] text-sm text-gray-400" >
    { format(new Date(order.created_at), "MMM d, h:mm a")}
</div>

{/* Customer */ }
<div className="flex-1 min-w-[200px] w-full md:w-auto pl-8 md:pl-0" >
    <div className="flex flex-col" >
        <span className="text-sm font-medium text-gray-300" >
            { order.customer_name || "Guest" }
            </span>
            < span className = "text-xs text-gray-500" >
                { order.customer_phone }
                </span>
                </div>
                </div>

{/* Status (Desktop) */ }
<div className="hidden md:block min-w-[140px]" >
    <span
                    className={
    `px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${getStatusColor(
        order.status
    )
        .replace("bg-", "bg-opacity-10 bg-")
        .replace("border-", "border border-opacity-20 ")}`
}
                >
    { order.status }
    </span>
    </div>

{/* Total */ }
<div className="min-w-[100px] w-full md:w-auto pl-8 md:pl-0 flex justify-between md:block items-center" >
    <span className="text-sm text-gray-500 md:hidden" > Total: </span>
        < div className = "text-right md:text-left" >
            <div className="font-bold text-[#2DE3A7]" >৳{ order.total } </div>
                < div className = "text-xs text-gray-500" >
                    { order.items?.length || 0 } Items
                        </div>
                        </div>
                        </div>

{/* Actions */ }
<div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pl-8 md:pl-0" >
    <div className="w-full md:w-40" >
        <SelectInput
                        value={ order.status }
options = { statusOptions }
onChange = {(val) => onStatusChange(order, val)}
className = "w-full"
    />
    </div>

    < a
href = { route("admin.orders.invoice", order.id) }
target = "_blank"
className = "p-2 bg-[#1E2826] text-gray-300 rounded-lg hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
title = "Invoice"
    >
    <FileText className="w-4 h-4" />
        </a>
        < button
className = "p-2 bg-[#1E2826] text-gray-300 rounded-lg hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
title = "Details"
    >
    <Eye className="w-4 h-4" />
        </button>
        </div>
        </div>
    );
}
