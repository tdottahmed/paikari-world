import React, { useState, ReactNode } from "react";
import { Head } from "@inertiajs/react";
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
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50">
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
