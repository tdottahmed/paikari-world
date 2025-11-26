import React from "react";
import { Search as SearchIcon } from "lucide-react";

export default function OrderEmptyState() {
    return (
        <div className="text-center py-12 bg-[#0E1614] rounded-xl border border-[#1E2826]">
            <div className="bg-[#1E2826] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white">
                {" "}
                No orders found{" "}
            </h3>
            <p className="text-gray-500 mt-1">
                {" "}
                Try adjusting your search or filters{" "}
            </p>
        </div>
    );
}
