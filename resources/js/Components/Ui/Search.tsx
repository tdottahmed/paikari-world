// Components/Ui/Search.tsx
import React, { useState, useRef, useEffect } from "react";
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync with external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Focus input when expanded
    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Close when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                if (isExpanded && !localValue) {
                    setIsExpanded(false);
                }
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isExpanded) {
                if (localValue) {
                    setLocalValue("");
                    onChange?.("");
                } else {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isExpanded, localValue, onChange]);

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        setLocalValue("");
        onChange?.("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(localValue);
    };

    return (
        <div
            ref={containerRef}
            className={`
                relative
                ${isExpanded ? "md:flex-1" : ""}
                ${className}
            `}
        >
            {/* Mobile: Search Icon Button (when collapsed) */}
            {!isExpanded && (
                <button
                    onClick={handleExpand}
                    disabled={disabled}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1E2826]"
                    aria-label="Open search"
                >
                    <SearchIcon size={20} />
                </button>
            )}

            {/* Search Input Container - Full width on mobile when expanded */}
            <div
                className={`
                transition-all duration-300 ease-in-out
                ${
                    isExpanded
                        ? "fixed inset-0 md:relative md:inset-auto z-50 bg-[#0C1311] md:bg-transparent"
                        : "md:block hidden"
                }
            `}
            >
                {/* Mobile Overlay Header */}
                {isExpanded && (
                    <div className="md:hidden flex items-center justify-between p-4 border-b border-[#1E2826] bg-[#0E1614]">
                        <form onSubmit={handleSubmit} className="flex-1">
                            <div className="relative">
                                <SearchIcon
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={localValue}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    autoFocus={autoFocus}
                                    className={`
                                        w-full bg-[#0F1A18] border border-[#1E2826] 
                                        text-white placeholder-gray-500
                                        pl-10 pr-10 py-3
                                        rounded-lg
                                        focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                                        transition-all duration-200
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        text-base
                                        min-h-[44px]
                                        ${inputClassName}
                                    `}
                                />
                                {localValue && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLocalValue("");
                                            onChange?.("");
                                        }}
                                        className="
                                            absolute right-3 top-1/2 transform -translate-y-1/2
                                            p-1 text-gray-400 hover:text-white 
                                            transition-colors rounded
                                        "
                                        aria-label="Clear search"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </form>
                        <button
                            onClick={handleCollapse}
                            className="ml-3 px-3 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Desktop Search Input */}
                {!isExpanded && (
                    <form onSubmit={handleSubmit} className="relative">
                        <SearchIcon
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            value={localValue}
                            onChange={handleChange}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            className={`
                                w-full bg-[#0F1A18] border border-[#1E2826] 
                                text-white placeholder-gray-500
                                pl-10 pr-4 py-2.5
                                rounded-lg
                                focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]
                                transition-all duration-200
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${inputClassName}
                            `}
                        />
                        {localValue && (
                            <button
                                type="button"
                                onClick={() => {
                                    setLocalValue("");
                                    onChange?.("");
                                }}
                                className="
                                    absolute right-3 top-1/2 transform -translate-y-1/2
                                    p-1 text-gray-400 hover:text-white 
                                    transition-colors rounded
                                "
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Search;
