import React from "react";
import { Home, ShoppingBag, Package, Grid } from "lucide-react";
import { Link } from "@inertiajs/react";

interface MobileBottomNavProps {
    active?: string;
    onSecondaryToggle: () => void;
}

const mobileMenuItems = [
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
    { key: "more", label: "More", icon: <Grid size={20} />, route: null },
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    active,
    onSecondaryToggle,
}) => {
    const handleMoreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onSecondaryToggle();
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0E1614] border-t border-gray-800 z-30 md:hidden">
            <div className="flex justify-around items-center">
                {mobileMenuItems.map((item) => {
                    const isMore = item.key === "more";
                    const href = item.route ? route(item.route) : "#";

                    return (
                        <Link
                            key={item.key}
                            href={href}
                            className={`flex flex-col items-center py-3 px-4 flex-1 transition-all ${
                                active === item.key
                                    ? "text-[#2DE3A7]"
                                    : "text-gray-300"
                            }`}
                            onClick={isMore ? handleMoreClick : undefined}
                        >
                            {item.icon}
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
