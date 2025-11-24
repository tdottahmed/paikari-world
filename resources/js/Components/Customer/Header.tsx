import React from "react";
import { Link } from "@inertiajs/react";
import { Search, ShoppingCart, Menu, User, MessageCircle } from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";

interface HeaderProps {
    onCartClick: () => void;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onMenuClick }) => {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuClick}
                            className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900"
                        >
                            <Menu size={24} />
                        </button>
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center"
                        >
                            <ApplicationLogo
                                applicationName="Paikari World"
                                size="md"
                            />
                            <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                                Paikari World
                            </span>
                        </Link>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href={route("login")}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <User size={20} />
                        </Link>

                        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                            <MessageCircle size={20} />
                        </button>

                        <button
                            onClick={onCartClick}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            <span className="hidden sm:inline text-sm font-medium">
                                {" "}
                                Cart{" "}
                            </span>
                            <div className="relative">
                                <ShoppingCart size={20} />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    0
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Search (visible only on small screens) */}
            <div className="md:hidden px-4 pb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search..."
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
