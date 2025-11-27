import React, { useState, ReactNode } from "react";
import { Head, usePage } from "@inertiajs/react";
import { ShoppingBag } from "lucide-react";
import Header from "@/Components/Customer/Header";
import CartSidebar from "@/Components/Customer/CartSidebar";
import CategorySidebar from "@/Components/Customer/CategorySidebar";
import Preloader from "@/Components/Utility/Preloader";

interface CustomerLayoutProps {
    children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { props } = usePage();
    const cart = (props.cart as Record<string, any>) || {};
    const cartItemCount = Object.values(cart).length;

    React.useEffect(() => {
        const handleOpenCart = () => {
            if (window.innerWidth >= 768) {
                setIsCartOpen(true);
            }
        };
        window.addEventListener("open-cart", handleOpenCart);
        return () => window.removeEventListener("open-cart", handleOpenCart);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* {isLoading && <Preloader onFinish={() => setIsLoading(false)} />} */}

            <Header
                onCartClick={() => setIsCartOpen(true)}
                onMenuClick={() => setIsMenuOpen(true)}
            />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <CategorySidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <main> {children} </main>

            {/* Floating Cart Button for Mobile */}
            {cartItemCount > 0 && (
                <div className="fixed bottom-6 right-6 z-40 md:hidden">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-[#1A1B2E] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 hover:bg-[#2D2E45] transition-colors"
                    >
                        <div className="relative">
                            <ShoppingBag size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm"> View Cart </span>
                    </button>
                </div>
            )}

            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        & copy; {new Date().getFullYear()} Paikari World.All
                        rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLayout;
