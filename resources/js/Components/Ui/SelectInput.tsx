import React from "react";
import Select, { StylesConfig, GroupBase } from "react-select";
import InputLabel from "./InputLabel";

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    label?: string;
    options: SelectOption[];
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    isSearchable?: boolean;
    error?: string;
    id?: string;
    name?: string;
    isDisabled?: boolean;
    className?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    options = [],
    value,
    onChange,
    placeholder = "Select...",
    isSearchable = true,
    error,
    id,
    name,
    isDisabled = false,
    className = "",
}) => {
    const handleChange = (selectedOption: SelectOption | null) => {
        onChange(selectedOption ? selectedOption.value : null);
    };

    const selectedValue = options.find((option) => option.value === value);

    // Custom styles for react-select
    const customStyles: StylesConfig<
        SelectOption,
        false,
        GroupBase<SelectOption>
    > = {
        control: (base, state) => ({
            ...base,
            borderColor: error ? "#ef4444" : "#d1d5db",
            borderRadius: "0.375rem",
            padding: "2px 4px",
            minHeight: "42px",
            "&:hover": {
                borderColor: error ? "#ef4444" : "#9ca3af",
            },
            boxShadow: state.isFocused
                ? error
                    ? "0 0 0 1px #ef4444"
                    : "0 0 0 1px #3b82f6"
                : "none",
            borderWidth: "1px",
            backgroundColor: isDisabled ? "#f9fafb" : "#ffffff",
        }),
        menu: (base) => ({
            ...base,
            zIndex: 50,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#3b82f6"
                : state.isFocused
                ? "#f3f4f6"
                : "#ffffff",
            color: state.isSelected ? "#ffffff" : "#1f2937",
            "&:active": {
                backgroundColor: "#3b82f6",
                color: "#ffffff",
            },
        }),
        singleValue: (base) => ({
            ...base,
            color: "#1f2937",
        }),
        placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
        }),
    };

    return (
        <div className={`w-full ${className}`}>
            {label && <InputLabel htmlFor={id} value={label} />}
            <Select<SelectOption>
                id={id}
                name={name}
                options={options}
                value={selectedValue}
                onChange={handleChange}
                placeholder={placeholder}
                isSearchable={isSearchable}
                isDisabled={isDisabled}
                styles={customStyles}
                className="mt-1"
                classNamePrefix="react-select"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default SelectInput;
