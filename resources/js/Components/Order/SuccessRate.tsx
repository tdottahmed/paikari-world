import React from "react";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

export interface SuccessRateData {
    total_orders: number;
    successful_orders: number;
    cancel_orders: number;
}

interface Props {
    rate?: SuccessRateData;
    className?: string;
}

export default function SuccessRate({ rate, className = "" }: Props) {
    if (!rate || rate.total_orders === 0) {
        return null;
    }

    const percentage = Math.round(
        (rate.successful_orders / rate.total_orders) * 100
    );

    const getRateConfig = (p: number) => {
        if (p >= 90) {
            return {
                icon: ShieldCheck,
                text: "text-green-500",
                bg: "bg-green-500",
                label: "Excellent",
            };
        } else if (p >= 70) {
            return {
                icon: Shield,
                text: "text-blue-500",
                bg: "bg-blue-500",
                label: "Good",
            };
        } else if (p >= 50) {
            return {
                icon: Shield,
                text: "text-yellow-500",
                bg: "bg-yellow-500",
                label: "Average",
            };
        } else {
            return {
                icon: ShieldAlert,
                text: "text-red-500",
                bg: "bg-red-500",
                label: "Risk",
            };
        }
    };

    const config = getRateConfig(percentage);
    const Icon = config.icon;

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Icon size={14} className={config.text} />
                    <span className={`text-xs font-medium ${config.text}`}>
                        {config.label}
                    </span>
                </div>
                <span className={`text-xs font-bold ${config.text}`}>
                    {percentage} %
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-[#1E2826] rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${config.bg}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/50">
                        {" "}
                    </span>
                    <span> {rate.successful_orders} Success </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50">
                        {" "}
                    </span>
                    <span> {rate.cancel_orders} Cancel </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500/50">
                        {" "}
                    </span>
                    <span> {rate.total_orders} Total </span>
                </div>
            </div>
        </div>
    );
}
