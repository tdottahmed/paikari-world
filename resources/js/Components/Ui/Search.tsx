import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchProps {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    autoFocus?: boolean;
    disabled?: boolean;
}

const Search: React.FC<SearchProps> = ({
    value = "",
    onChange,
    onSubmit,
    placeholder = "Search...",
    className = "",
    inputClassName = "",
    autoFocus = false,
    disabled = false,
}) => {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleClear = useCallback(() => {
        setLocalValue("");
        onChange?.("");
        inputRef.current?.focus();
    }, [onChange]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setLocalValue(newValue);
            onChange?.(newValue);
        },
        [onChange]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            onSubmit?.(localValue.trim());
        },
        [localValue, onSubmit]
    );

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit}>
                <SearchIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                    aria-hidden="true"
                />
                <input
                    ref={inputRef}
                    type="text"
                    value={localValue}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        w-full bg-[#0F1A18] border border-[#1E2826] 
                        text-white placeholder-gray-500
                        pl-10 pr-8 py-2.5
                        rounded-lg
                        focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${inputClassName}
                    `}
                    aria-label="Search input"
                />
                {localValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors rounded"
                        aria-label="Clear search input"
                    >
                        <X size={14} />
                    </button>
                )}
            </form>
        </div>
    );
};

export default Search;
