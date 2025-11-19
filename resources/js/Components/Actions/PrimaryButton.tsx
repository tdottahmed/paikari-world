import React from "react";

interface PrimaryButtonProps {
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    type = "submit",
    className = "",
    disabled = false,
    children,
    onClick,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center px-4 py-3 
                bg-[#2DE3A7] border border-transparent 
                rounded-lg font-semibold text-sm text-[#0C1311] 
                uppercase tracking-widest 
                transition-all duration-200 ease-in-out
                hover:bg-[#22c996] 
                focus:outline-none focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
                active:bg-[#1cb583]
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default PrimaryButton;
