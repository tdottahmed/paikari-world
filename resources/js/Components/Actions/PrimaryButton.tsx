import React from "react";
import { Link } from "@inertiajs/react";

interface BaseButtonProps {
    variant?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
    fullWidth?: boolean;
}

interface ButtonAsButtonProps extends BaseButtonProps {
    as?: "button";
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    href?: never;
}

interface ButtonAsLinkProps extends BaseButtonProps {
    as: "link";
    href: string;
    type?: never;
    onClick?: never;
}

interface ButtonAsAnchorProps extends BaseButtonProps {
    as: "a";
    href: string;
    type?: never;
    onClick?: () => void;
}

type PrimaryButtonProps =
    | ButtonAsButtonProps
    | ButtonAsLinkProps
    | ButtonAsAnchorProps;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    as = "button",
    type = "submit",
    variant = "solid",
    size = "md",
    disabled = false,
    loading = false,
    children,
    className = "",
    fullWidth = false,
    ...props
}) => {
    const sizeClasses = {
        sm: "px-3 py-2 text-xs sm:px-3 sm:py-2",
        md: "px-4 py-3 text-sm sm:px-4 sm:py-3",
        lg: "px-4 py-3 text-base sm:px-6 sm:py-4",
    };

    // Variant classes with better mobile contrast
    const variantClasses = {
        solid: `
            bg-[#2DE3A7] border border-transparent 
            text-[#0C1311] 
            hover:bg-[#22c996] 
            focus:bg-[#22c996] focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#1cb583] active:scale-95
            disabled:bg-[#2DE3A7]/50 disabled:text-[#0C1311]/70 disabled:cursor-not-allowed disabled:scale-100
            transition-all duration-200 ease-in-out
        `,
        outline: `
            bg-transparent border border-[#2DE3A7] 
            text-[#2DE3A7] 
            hover:bg-[#2DE3A7] hover:text-[#0C1311] 
            focus:bg-[#2DE3A7] focus:text-[#0C1311] focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#22c996] active:text-[#0C1311] active:scale-95
            disabled:border-[#2DE3A7]/50 disabled:text-[#2DE3A7]/50 disabled:cursor-not-allowed disabled:scale-100
            transition-all duration-200 ease-in-out
        `,
        ghost: `
            bg-transparent border border-transparent 
            text-[#2DE3A7] 
            hover:bg-[#2DE3A7]/10 
            focus:bg-[#2DE3A7]/10 focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#2DE3A7]/20 active:scale-95
            disabled:text-[#2DE3A7]/50 disabled:cursor-not-allowed disabled:scale-100
            transition-all duration-200 ease-in-out
        `,
    };

    const baseClasses = `
        inline-flex items-center justify-center gap-2
        rounded-lg font-semibold 
        uppercase tracking-widest 
        focus:outline-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${
            disabled || loading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
        }
        ${className}
        
        /* Mobile-specific improvements */
        min-h-[44px] /* Minimum touch target size for mobile */
        text-center
        break-words /* Handle long text on mobile */
        whitespace-nowrap /* Prevent text wrapping on mobile */
    `;

    const content = (
        <>
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span className="text-inherit">Loading...</span>
                </div>
            ) : (
                children
            )}
        </>
    );

    if (as === "link") {
        return (
            <Link
                href={props.href}
                className={baseClasses}
                onClick={(e) => {
                    if (disabled || loading) {
                        e.preventDefault();
                    }
                }}
                aria-disabled={disabled || loading}
            >
                {content}
            </Link>
        );
    }

    if (as === "a") {
        return (
            <a
                href={props.href}
                className={baseClasses}
                onClick={(e) => {
                    if (disabled || loading) {
                        e.preventDefault();
                        return;
                    }
                    props.onClick?.();
                }}
                aria-disabled={disabled || loading}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={baseClasses}
            onClick={props.onClick}
            aria-busy={loading}
        >
            {content}
        </button>
    );
};

export default PrimaryButton;
