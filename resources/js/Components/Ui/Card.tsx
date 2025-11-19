import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
    hover?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = "",
    padding = "md",
    hover = false,
}) => {
    const paddingClasses = {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    };

    return (
        <div
            className={`
            bg-[#0E1614] border border-[#1E2826] rounded-lg
            transition-all duration-200
            ${paddingClasses[padding]}
            ${
                hover
                    ? "hover:border-[#2DE3A7] hover:shadow-lg hover:shadow-[#2DE3A7]/5"
                    : ""
            }
            ${className}
        `}
        >
            {children}
        </div>
    );
};

// Card Header Component
interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    withBorder?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    children,
    className = "",
    withBorder = true,
}) => {
    return (
        <div
            className={`
            ${withBorder ? "border-b border-[#1E2826] pb-4" : ""}
            ${className}
        `}
        >
            {children}
        </div>
    );
};

// Card Title Component
interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle: React.FC<CardTitleProps> = ({
    children,
    className = "",
    as: Tag = "h2",
}) => {
    return (
        <Tag
            className={`
            text-lg font-semibold text-white
            ${className}
        `}
        >
            {children}
        </Tag>
    );
};

// Card Description Component
interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
    children,
    className = "",
}) => {
    return (
        <p
            className={`
            mt-1 text-sm text-gray-400
            ${className}
        `}
        >
            {children}
        </p>
    );
};

// Card Content Component
interface CardContentProps {
    children: React.ReactNode;
    className?: string;
    padding?: "none" | "sm" | "md" | "lg";
}

export const CardContent: React.FC<CardContentProps> = ({
    children,
    className = "",
    padding = "md",
}) => {
    const paddingClasses = {
        none: "",
        sm: "py-2",
        md: "py-4",
        lg: "py-6",
    };

    return (
        <div
            className={`
            ${paddingClasses[padding]}
            ${className}
        `}
        >
            {children}
        </div>
    );
};

// Card Footer Component
interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
    withBorder?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
    children,
    className = "",
    withBorder = true,
}) => {
    return (
        <div
            className={`
            ${withBorder ? "border-t border-[#1E2826] pt-4" : ""}
            ${className}
        `}
        >
            {children}
        </div>
    );
};

export default Card;
