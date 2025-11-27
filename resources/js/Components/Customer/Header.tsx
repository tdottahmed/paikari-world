import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { User, MessageCircle, X, Menu } from "lucide-react";
import { CartItem, PageProps } from "@/types";

import Logo from "./Header/Logo";
import MobileMenuButton from "./Header/MobileMenuButton";
import MessengerIcon from "./Header/MessengerIcon";
import CartIcon from "./Header/CartIcon";
import SearchToggle from "./Header/SearchToggle";
import SearchAutocomplete from "./SearchAutocomplete";

interface HeaderProps {
    onCartClick: () => void;
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onMenuClick }) => {
    const { props } = usePage<PageProps<{ cart: Record<string, CartItem> }>>();
    const cart = props.cart || {};
    const cartItemCount = Object.values(cart).reduce(
        (acc: number, item: CartItem) => acc + item.quantity,
        0
    );

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        {/* Mobile Left: Menu & Messenger */}
                        <div className="flex items-center gap-2 md:hidden">
                            <MobileMenuButton onClick={onMenuClick} />
                            <MessengerIcon />
                        </div>

                        {/* Desktop Left: Menu & Logo */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={onMenuClick}
                                className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900"
                            >
                                <Menu size={24} />
                            </button>
                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                <MessageCircle size={20} />
                            </button>
                            <Logo />
                        </div>

                        {/* Mobile Logo (Centered) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
                            <Logo />
                        </div>

                        {/* Desktop Search (Center) */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                            <SearchAutocomplete />
                        </div>

                        {/* Mobile Right: Search & Cart */}
                        <div className="flex items-center gap-2 md:hidden">
                            <SearchToggle
                                onClick={() => setIsMobileSearchOpen(true)}
                            />
                            <button
                                onClick={onCartClick}
                                className="p-2 text-gray-800 hover:text-gray-900 transition-colors"
                            >
                                <CartIcon count={cartItemCount} />
                            </button>
                        </div>

                        {/* Desktop Right: Cart */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-4">
                            <button
                                onClick={onCartClick}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <span className="hidden sm:inline text-sm font-medium">
                                    Cart
                                </span>
                                <CartIcon
                                    count={cartItemCount}
                                    className="text-white"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Modal */}
                {isMobileSearchOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileSearchOpen(false)}
                        />

                        {/* Modal Content */}
                        <div className="absolute top-0 left-0 right-0 bg-white shadow-lg flex flex-col">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <SearchAutocomplete
                                            isMobile={true}
                                            onClose={() =>
                                                setIsMobileSearchOpen(false)
                                            }
                                        />
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsMobileSearchOpen(false)
                                        }
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
