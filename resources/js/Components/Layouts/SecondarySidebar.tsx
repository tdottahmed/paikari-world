import React from "react";
import {
    BadgePercent,
    Globe,
    Users,
    Truck,
    Calculator,
    Target,
    LogOutIcon,
    X,
} from "lucide-react";
import { useForm } from "@inertiajs/react";

interface SecondarySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    mobile?: boolean;
}

interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
}

const secondaryMenuItems: MenuItem[] = [
    {
        key: "categories",
        label: "Categories",
        icon: <BadgePercent size={18} />,
    },
    { key: "discounts", label: "Discounts", icon: <BadgePercent size={18} /> },
    { key: "website", label: "Website", icon: <Globe size={18} /> },
    { key: "users", label: "Users", icon: <Users size={18} /> },
    { key: "gateway", label: "Payment Gateways", icon: <Truck size={18} /> },
    { key: "courier", label: "Courier", icon: <Truck size={18} /> },
    { key: "price", label: "Price Calculator", icon: <Calculator size={18} /> },
    { key: "marketing", label: "Marketing", icon: <Target size={18} /> },
];

// Reusable Menu Link Component
const MenuLink = ({
    item,
    onClick,
}: {
    item: MenuItem;
    onClick?: () => void;
}) => (
    <a
        href="#"
        onClick={onClick}
        className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-[#151F1D] hover:text-white transition-all"
    >
        {item.icon}
        <span>{item.label}</span>
    </a>
);

const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
    isOpen,
    onClose,
    mobile = false,
}) => {
    const { post } = useForm();

    const handleLogout = () => {
        post(route("logout"), {
            onFinish: () => onClose(),
        });
    };

    /* MOBILE SIDEBAR */
    if (mobile) {
        return (
            <div className="bg-[#0E1614] p-6 max-h-96 overflow-y-auto">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Menu</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[#151F1D]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Items */}
                <nav className="space-y-2">
                    {secondaryMenuItems.map((item) => (
                        <MenuLink
                            key={item.key}
                            item={item}
                            onClick={onClose}
                        />
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-600/10 transition-all w-full text-left"
                    >
                        <LogOutIcon size={18} />
                        <span>Logout</span>
                    </button>
                </nav>
            </div>
        );
    }

    /* DESKTOP SIDEBAR */
    return (
        <aside className="w-64 bg-[#0E1614] border-r border-gray-800 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-semibold">Paikari World</h2>
                <p className="text-sm text-gray-400">pw@gmail.com</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {secondaryMenuItems.map((item) => (
                    <MenuLink key={item.key} item={item} />
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-600/10 transition-all w-full text-left"
                >
                    <LogOutIcon size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default SecondarySidebar;
