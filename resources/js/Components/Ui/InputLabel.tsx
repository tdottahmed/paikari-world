import React from "react";

interface InputLabelProps {
    htmlFor: string;
    value: string;
    className?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({
    htmlFor,
    value,
    className = "",
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`
                block text-sm font-medium 
                text-gray-300 
                mb-2
                ${className}
            `}
        >
            {value}
        </label>
    );
};

export default InputLabel;
