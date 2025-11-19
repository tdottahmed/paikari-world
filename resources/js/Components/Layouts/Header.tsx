import React from "react";

const Header: React.FC = () => {
    return (
        <header className="bg-[#0E1614] border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
                <div className="flex items-center gap-4">
                </div>
            </div>
        </header>
    );
};

export default Header;
