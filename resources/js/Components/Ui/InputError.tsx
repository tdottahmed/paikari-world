import React from "react";

interface InputErrorProps {
    message?: string;
    className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ message, className = "" }) => {
    return message ? (
        <div
            className={`
            text-sm text-red-400 
            bg-red-400/10 border border-red-400/20 
            px-3 py-2 rounded-lg
            ${className}
        `}
        >
            {message}
        </div>
    ) : null;
};

export default InputError;
