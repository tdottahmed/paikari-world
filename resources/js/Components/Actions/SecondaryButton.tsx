import React from "react";

interface SecondaryButtonProps {
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
    variant?: "solid" | "outline" | "ghost";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
    type = "button",
    className = "",
    disabled = false,
    children,
    onClick,
    size = "md",
    variant = "solid",
}) => {
    // Size classes
    const sizeClasses = {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-3 text-sm",
        lg: "px-6 py-4 text-base",
    };

    // Variant classes - Gray color scheme that matches your theme
    const variantClasses = {
        solid: `
            bg-[#1E2826] border border-[#2A3634] 
            text-gray-300 
            hover:bg-[#2A3634] hover:text-white
            focus:bg-[#2A3634] focus:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#374140]
            disabled:bg-[#1E2826] disabled:text-gray-500 disabled:cursor-not-allowed
        `,
        outline: `
            bg-transparent border border-[#2A3634] 
            text-gray-400 
            hover:bg-[#2A3634] hover:text-white
            focus:bg-[#2A3634] focus:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#374140] active:text-white
            disabled:border-[#2A3634] disabled:text-gray-500 disabled:cursor-not-allowed
        `,
        ghost: `
            bg-transparent border border-transparent 
            text-gray-400 
            hover:bg-[#2A3634]/50 hover:text-white
            focus:bg-[#2A3634]/50 focus:text-white focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#2A3634]
            disabled:text-gray-500 disabled:cursor-not-allowed
        `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center justify-center
                rounded-lg font-semibold 
                uppercase tracking-widest 
                transition-all duration-200 ease-in-out
                focus:outline-none
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default SecondaryButton;
