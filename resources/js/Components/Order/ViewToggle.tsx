import React from "react";
import { LayoutGrid, List } from "lucide-react";

interface Props {
    viewMode: "grid" | "list";
    onChange: (mode: "grid" | "list") => void;
}

export default function ViewToggle({ viewMode, onChange }: Props) {
    return (
        <div className="hidden md:block flex bg-[#0E1614] p-1 rounded-lg border border-[#1E2826]">
            <button
                onClick={() => onChange("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                        ? "bg-[#2DE3A7] text-[#0C1311] shadow-lg shadow-[#2DE3A7]/20"
                        : "text-gray-400 hover:text-white hover:bg-[#1E2826]"
                }`}
                title="Grid View"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => onChange("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                        ? "bg-[#2DE3A7] text-[#0C1311] shadow-lg shadow-[#2DE3A7]/20"
                        : "text-gray-400 hover:text-white hover:bg-[#1E2826]"
                }`}
                title="List View"
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    );
}
