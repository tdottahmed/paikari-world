import {
    Clock,
    PhoneOff,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    RotateCcw,
    AlertCircle,
} from "lucide-react";

interface Props {
    status: string;
    className?: string;
}

export default function OrderStatus({ status, className = "" }: Props) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "pending":
                return {
                    icon: Clock,
                    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
                    label: "Pending",
                };
            case "unreachable":
                return {
                    icon: PhoneOff,
                    color: "text-red-500 bg-red-500/10 border-red-500/20",
                    label: "Unreachable",
                };
            case "preparing":
                return {
                    icon: Package,
                    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
                    label: "Preparing",
                };
            case "shipping":
                return {
                    icon: Truck,
                    color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
                    label: "Shipping",
                };
            case "completed":
                return {
                    icon: CheckCircle,
                    color: "text-green-500 bg-green-500/10 border-green-500/20",
                    label: "Completed",
                };
            case "cancelled":
                return {
                    icon: XCircle,
                    color: "text-red-500 bg-red-500/10 border-red-500/20",
                    label: "Cancelled",
                };
            case "returned":
                return {
                    icon: RotateCcw,
                    color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
                    label: "Returned",
                };
            case "delivered":
                return {
                    icon: CheckCircle,
                    color: "text-green-500 bg-green-500/10 border-green-500/20",
                    label: "Delivered",
                };
            default:
                return {
                    icon: AlertCircle,
                    color: "text-gray-400 bg-gray-500/10 border-gray-500/20",
                    label: status,
                };
        }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color} ${className}`}
        >
            <Icon size={14} className="mr-1.5" />
            <span className="uppercase tracking-wide"> {config.label} </span>
        </span>
    );
}
