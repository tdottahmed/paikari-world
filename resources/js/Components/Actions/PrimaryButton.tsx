import React from "react";
import { Link } from "@inertiajs/react";

interface BaseButtonProps {
    variant?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
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
    ...props
}) => {
    // Size classes
    const sizeClasses = {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-3 text-sm",
        lg: "px-6 py-4 text-base",
    };

    // Variant classes
    const variantClasses = {
        solid: `
            bg-[#2DE3A7] border border-transparent 
            text-[#0C1311] 
            hover:bg-[#22c996] 
            focus:bg-[#22c996] focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#1cb583]
            disabled:bg-[#2DE3A7]/50 disabled:text-[#0C1311]/70 disabled:cursor-not-allowed
        `,
        outline: `
            bg-transparent border border-[#2DE3A7] 
            text-[#2DE3A7] 
            hover:bg-[#2DE3A7] hover:text-[#0C1311] 
            focus:bg-[#2DE3A7] focus:text-[#0C1311] focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#22c996] active:text-[#0C1311]
            disabled:border-[#2DE3A7]/50 disabled:text-[#2DE3A7]/50 disabled:cursor-not-allowed
        `,
        ghost: `
            bg-transparent border border-transparent 
            text-[#2DE3A7] 
            hover:bg-[#2DE3A7]/10 
            focus:bg-[#2DE3A7]/10 focus:ring-2 focus:ring-[#2DE3A7] focus:ring-offset-2 focus:ring-offset-[#0E1614]
            active:bg-[#2DE3A7]/20
            disabled:text-[#2DE3A7]/50 disabled:cursor-not-allowed
        `,
    };

    const baseClasses = `
        inline-flex items-center justify-center gap-2
        rounded-lg font-semibold 
        uppercase tracking-widest 
        transition-all duration-200 ease-in-out
        focus:outline-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
    `;

    const content = (
        <>
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </>
    );

    // Render as Inertia Link
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
            >
                {content}
            </Link>
        );
    }

    // Render as regular anchor tag
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
            >
                {content}
            </a>
        );
    }

    // Render as button (default)
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={baseClasses}
            onClick={props.onClick}
        >
            {content}
        </button>
    );
};

export default PrimaryButton;
