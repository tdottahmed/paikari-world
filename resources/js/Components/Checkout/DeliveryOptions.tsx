import React from "react";
import { CheckCircle2 } from "lucide-react";
import { DeliveryCharge } from "@/types";

interface DeliveryOptionsProps {
    deliveryCharges: DeliveryCharge[];
    selectedId: string;
    onChange: (charge: DeliveryCharge) => void;
    error?: string;
}

export default function DeliveryOptions({
    deliveryCharges,
    selectedId,
    onChange,
    error,
}: DeliveryOptionsProps) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </span>
                Delivery Charge
            </h3>
            <div className="space-y-3">
                {deliveryCharges.map((charge) => (
                    <label
                        key={charge.id}
                        className={`relative flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedId === charge.id.toString()
                                ? "border-gray-800 bg-gray-50 ring-1 ring-gray-800"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <input
                            type="radio"
                            name="delivery_charge"
                            value={charge.id}
                            checked={selectedId === charge.id.toString()}
                            onChange={() => onChange(charge)}
                            className="h-5 w-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                        />
                        <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="block text-sm font-medium text-gray-900">
                                    {charge.name}
                                </span>
                                <span className="block text-sm font-bold text-gray-900">
                                    ৳{charge.cost}
                                </span>
                            </div>
                            <span className="block text-xs text-gray-500 mt-0.5">
                                ({charge.duration})
                            </span>
                        </div>
                    </label>
                ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2"> {error} </p>}
        </div>
    );
}
