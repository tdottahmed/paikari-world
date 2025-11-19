import React from "react";
import { Home, ShoppingBag, Package, Grid } from "lucide-react";
import { Link } from "@inertiajs/react";

interface PrimarySidebarProps {
    active?: string;
    onMoreClick?: () => void;
}

const primaryMenuItems = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <Home size={20} />,
        route: "admin.dashboard",
    },
    {
        key: "products",
        label: "Products",
        icon: <ShoppingBag size={20} />,
        route: "admin.products.index",
    },
    {
        key: "orders",
        label: "Orders",
        icon: <Package size={20} />,
        route: null,
    },
    {
        key: "more",
        label: "More",
        icon: <Grid size={20} />,
        route: null, // No route for More, it's a toggle
    },
];

const PrimarySidebar: React.FC<PrimarySidebarProps> = ({
    active,
    onMoreClick,
}) => {
    const handleItemClick = (item: (typeof primaryMenuItems)[0]) => {
        if (item.key === "more" && onMoreClick) {
            onMoreClick();
        }
    };

    return (
        <aside className="w-20 bg-[#0E1614] border-r border-gray-800 flex flex-col items-center py-6">
            <div className="mb-8">
                <div className="w-10 h-10 bg-[#2DE3A7] rounded-lg flex items-center justify-center text-black font-bold text-sm">
                    PW
                </div>
            </div>

            <nav className="flex-1 space-y-4">
                {primaryMenuItems.map((item) => (
                    <div key={item.key}>
                        {item.route ? (
                            <Link
                                href={route(item.route)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                                    active === item.key
                                        ? "bg-[#0F1A18] text-[#2DE3A7]"
                                        : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
                                }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">
                                    {item.label}
                                </span>
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleItemClick(item)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all w-full ${
                                    active === item.key
                                        ? "bg-[#0F1A18] text-[#2DE3A7]"
                                        : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
                                }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">
                                    {item.label}
                                </span>
                            </button>
                        )}
                    </div>
                ))}
            </nav>

            <div className="mt-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                    PW
                </div>
            </div>
        </aside>
    );
};

export default PrimarySidebar;
