import Header from "@/Components/Layouts/Header";
import MobileBottomNav from "@/Components/Layouts/MobileBottomNav";
import PrimarySidebar from "@/Components/Layouts/PrimarySidebar";
import SecondarySidebar from "@/Components/Layouts/SecondarySidebar";
import { Head, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

interface LayoutProps {
    children: React.ReactNode;
    active?: string;
    head?: React.ReactNode;
    title?: string;
}

const Master: React.FC<LayoutProps> = ({ children, active, head, title }) => {
    const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);
    const { props } = usePage();
    const { flash, errors } = props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (Object.keys(errors).length > 0) {
            toast.error("There are errors in the form. Please check the fields.");
        }
    }, [flash, errors]);

    return (
        <div className= "flex min-h-screen bg-[#0C1311] text-gray-100" >
        <Head title={ title } />
            < Toaster position = "top-right" richColors />

                <div className="hidden md:flex flex-1" >
                    <PrimarySidebar
                    active={ active }
    onMoreClick = {() => setIsSecondarySidebarOpen(true)}
                />

{
    isSecondarySidebarOpen && (
        <SecondarySidebar
                        isOpen={ isSecondarySidebarOpen }
    onClose = {() => setIsSecondarySidebarOpen(false)
}
                    />
                )}

<div className="flex-1 flex flex-col min-w-0" >
    { head? head: <Header showUserMenu={ true } />}
<main className="flex-1 overflow-auto p-6" > { children } </main>
    </div>
    </div>

    < div className = "flex flex-1 flex-col md:hidden" >
        { head? head: <Header showUserMenu={ true } />}

<main className="flex-1 overflow-auto p-4 pb-20" >
    { children }
    </main>

    < MobileBottomNav
active = { active }
onSecondaryToggle = {() =>
setIsSecondarySidebarOpen(!isSecondarySidebarOpen)
                    }
                />
    </div>

{/* Mobile Overlay */ }
{
    isSecondarySidebarOpen && (
        <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
    onClick = {() => setIsSecondarySidebarOpen(false)
}
                />
            )}

{/* Mobile Secondary Sidebar */ }
<div
                className={
    `
                    fixed bottom-0 left-0 right-0 z-50 
                    transform transition-transform duration-300 ease-in-out
                    bg-[#0E1614] border-t border-gray-800
                    ${isSecondarySidebarOpen
        ? "translate-y-0"
        : "translate-y-full"
    }
                    md:hidden
                `}
            >
    <SecondarySidebar
                    isOpen={ isSecondarySidebarOpen }
onClose = {() => setIsSecondarySidebarOpen(false)}
mobile
    />
    </div>
    </div>
    );
};

export default Master;
