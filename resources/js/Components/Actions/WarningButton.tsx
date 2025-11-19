import React from "react";

interface WarningButtonProps {
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
    variant?: "solid" | "outline" | "ghost";
}

const WarningButton: React.FC<WarningButtonProps> = ({
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

    // Variant classes - Amber/Yellow color scheme
    const variantClasses = {
        solid: `
            bg-amber-500 border border-transparent 
            text-[#0C1311] 
            hover:bg-amber-600 
            focus:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-amber-700
            disabled:bg-amber-300 disabled:text-amber-100 disabled:cursor-not-allowed
        `,
        outline: `
            bg-transparent border border-amber-500 
            text-amber-500 
            hover:bg-amber-500 hover:text-[#0C1311] 
            focus:bg-amber-500 focus:text-[#0C1311] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-amber-600 active:text-[#0C1311]
            disabled:border-amber-300 disabled:text-amber-300 disabled:cursor-not-allowed
        `,
        ghost: `
            bg-transparent border border-transparent 
            text-amber-500 
            hover:bg-amber-500/10 
            focus:bg-amber-500/10 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-amber-500/20
            disabled:text-amber-300 disabled:cursor-not-allowed
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

export default WarningButton;
