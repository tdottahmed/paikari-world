import React, { useMemo } from "react";

interface ApplicationLogoProps {
    applicationName: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export default function ApplicationLogo({
    applicationName,
    className,
    size = "md",
}: ApplicationLogoProps) {
    const initials = useMemo(() => {
        if (!applicationName) return "APP";

        const words = applicationName.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return (words[0][0] + words[1][0]).toUpperCase();
    }, [applicationName]);

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-xl",
    };

    return (
        <div
            className={`flex items-center justify-center rounded-xl font-bold text-black shadow-lg bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-500 dark:to-primary-700 border border-white/10 ring-1 ring-black/5 ${
                sizeClasses[size]
            } ${className || ""}`}
        >
            <span className="drop-shadow-sm tracking-wider"> {initials} </span>
        </div>
    );
}
