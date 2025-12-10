import React from "react";

interface ToggleProps {
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toggle: React.FC<ToggleProps> = ({ name, checked, onChange }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div
                className={`
                    w-11 h-6 
                    rounded-full
                    transition-all duration-200 ease-in-out
                    ${
                        checked
                            ? "bg-[#2DE3A7]"
                            : "bg-[#1E2826] border border-[#2DE3A7]/30"
                    }
                `}
            >
                <div
                    className={`
                        absolute top-0.5 left-0.5
                        w-5 h-5
                        bg-white
                        rounded-full
                        transition-all duration-200 ease-in-out
                        shadow-lg
                        ${checked ? "translate-x-5" : "translate-x-0"}
                    `}
                />
            </div>
        </label>
    );
};

export default Toggle;
