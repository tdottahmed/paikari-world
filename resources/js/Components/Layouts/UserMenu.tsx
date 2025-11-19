import React, { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";

const UserMenu: React.FC = () => {
    const { auth }: any = usePage().props;
    const user = auth?.user;

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Default logout using Inertia
    const handleLogout = () => {
        router.post(route("logout"));
    };

    return (
        <div className="flex items-center space-x-3" ref={dropdownRef}>
            {/* User Avatar + Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#1E2826] transition-colors"
                >
                    {/* Name + Email */}
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-white">
                            {user?.name}
                        </p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-[#2DE3A7] rounded-full flex items-center justify-center border-2 border-[#2DE3A7]">
                        <span className="text-sm font-semibold text-[#0C1311]">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    {/* Arrow */}
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#0E1614] border border-[#1E2826] rounded-lg shadow-lg py-2 z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-[#1E2826]">
                            <p className="text-sm font-medium text-white">
                                {user?.name}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>

                        {/* Links */}
                        <div className="py-2">
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1E2826] hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                Your Profile
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1E2826] hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                Settings
                            </Link>

                            <Link
                                href="/billing"
                                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#1E2826] hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                Billing
                            </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-[#1E2826] pt-2">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-600/10"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;
