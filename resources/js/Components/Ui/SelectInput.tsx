import Select from "react-select";

interface Option {
    value: string | number;
    label: string;
}

interface SelectInputProps {
    id?: string;
    name?: string;
    value: string | number | null;
    options: Option[];
    placeholder?: string;
    onChange: (value: any) => void;
    error?: string;
    isSearchable?: boolean;
}

const brandStyles = {
    control: (base: any, state: any) => ({
        ...base,
        backgroundColor: "#0C1311",
        borderColor: state.isFocused ? "#2DE3A7" : "#1E2826",
        boxShadow: state.isFocused ? "0 0 0 1px #2DE3A7" : "none",
        ":hover": { borderColor: "#2DE3A7" },
        color: "#FFFFFF",
        padding: "2px",
        minHeight: "42px",
    }),

    singleValue: (base: any) => ({
        ...base,
        color: "#FFFFFF",
    }),

    input: (base: any) => ({
        ...base,
        color: "#FFFFFF",
    }),

    menu: (base: any) => ({
        ...base,
        backgroundColor: "#0C1311",
        border: "1px solid #1E2826",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        zIndex: 9999,
    }),

    menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
    }),

    menuList: (base: any) => ({
        ...base,
        padding: 0,
        maxHeight: "200px",
    }),

    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "#2DE3A7"
            : state.isFocused
                ? "#1A2522"
                : "#0C1311",
        color: state.isSelected ? "#0C1311" : "#FFFFFF",
        cursor: "pointer",
        padding: "10px 12px",
        ":active": {
            backgroundColor: "#2DE3A7",
        },
    }),

    placeholder: (base: any) => ({
        ...base,
        color: "#9CA3AF",
        opacity: 1,
    }),

    dropdownIndicator: (base: any, state: any) => ({
        ...base,
        color: state.isFocused ? "#2DE3A7" : "#6B7280",
        ":hover": { color: "#2DE3A7" },
        transition: "color 150ms",
    }),

    indicatorSeparator: (base: any) => ({
        ...base,
        backgroundColor: "#1E2826",
    }),

    clearIndicator: (base: any) => ({
        ...base,
        color: "#6B7280",
        ":hover": { color: "#2DE3A7" },
    }),
};

export default function SelectInput({
    id,
    name,
    value,
    options,
    onChange,
    placeholder = "Select",
    error,
    isSearchable = false,
    className = "",
}: SelectInputProps & { className?: string }) {
    const selectedOption =
        value !== null
            ? options.find((opt) => opt.value.toString() === value.toString())
            : null;

    return (
        <div className= { className } >
        <Select
                inputId={ id }
    name = { name }
    options = { options }
    value = { selectedOption || null
}
onChange = {(opt) => onChange(opt?.value ?? "")}
placeholder = { placeholder }
isSearchable = { isSearchable }
styles = { brandStyles }
tabSelectsValue = { false}
blurInputOnSelect = { true}
menuPlacement = "auto"
menuPortalTarget = { typeof document !== 'undefined' ? document.body : null }
menuPosition = "fixed"
    />

    { error && <p className="text-red-500 text-sm mt-1" > { error } </p>}
</div>
    );
}
