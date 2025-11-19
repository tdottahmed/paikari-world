import React from "react";

interface GuestLayoutProps {
    children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#0C1311]">
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-[#0E1614] shadow-md border border-[#1E2826] overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
};

export default GuestLayout;
