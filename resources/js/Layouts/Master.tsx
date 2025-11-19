import Header from "@/Components/Layouts/Header";
import MobileBottomNav from "@/Components/Layouts/MobileBottomNav";
import PrimarySidebar from "@/Components/Layouts/PrimarySidebar";
import SecondarySidebar from "@/Components/Layouts/SecondarySidebar";
import React, { useState } from "react";

interface LayoutProps {
    children: React.ReactNode;
    active?: string;
    header?: React.ReactNode;
}

const Master: React.FC<LayoutProps> = ({ children, active, header }) => {
    const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0C1311] text-gray-100">
            {/* Desktop Layout */}
            <div className="hidden md:flex flex-1">
                <PrimarySidebar active={active} />
                <SecondarySidebar
                    isOpen={isSecondarySidebarOpen}
                    onClose={() => setIsSecondarySidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    <Header />
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex flex-1 flex-col md:hidden">
                <Header />
                <main className="flex-1 overflow-auto p-4 pb-20">
                    {children}
                </main>
                <MobileBottomNav
                    active={active}
                    onSecondaryToggle={() =>
                        setIsSecondarySidebarOpen(!isSecondarySidebarOpen)
                    }
                />
            </div>

            {/* Mobile Secondary Sidebar Overlay */}
            {isSecondarySidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsSecondarySidebarOpen(false)}
                />
            )}

            {/* Mobile Secondary Sidebar */}
            <div
                className={`
                fixed bottom-0 left-0 right-0 z-50 
                transform transition-transform duration-300 ease-in-out
                bg-[#0E1614] border-t border-gray-800
                ${isSecondarySidebarOpen ? "translate-y-0" : "translate-y-full"}
                md:hidden
            `}
            >
                <SecondarySidebar
                    isOpen={isSecondarySidebarOpen}
                    onClose={() => setIsSecondarySidebarOpen(false)}
                    mobile
                />
            </div>
        </div>
    );
};

export default Master;
