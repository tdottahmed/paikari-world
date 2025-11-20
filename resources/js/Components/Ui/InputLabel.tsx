import React from "react";

interface InputLabelProps {
    htmlFor: string;
    value: string;
    className?: string;
    required?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({
    htmlFor,
    value,
    required = false,
    className = "",
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`
                text-sm font-semibold tracking-wide
                text-white/90
                mb-2 flex items-center gap-1
                transition-colors duration-200
                hover:text-[#2DE3A7]
                ${className}
            `}
        >
            {value}

            {required && <span className="text-[#2DE3A7] font-bold">*</span>}
        </label>
    );
};

export default InputLabel;
