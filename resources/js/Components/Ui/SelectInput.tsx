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
        borderColor: "#1E2826",
        boxShadow: "none",
        ":hover": { borderColor: "#2DE3A7" },
        color: "#FFFFFF",
        padding: "2px",
    }),

    singleValue: (base: any) => ({
        ...base,
        color: "#FFFFFF", // white
    }),

    menu: (base: any) => ({
        ...base,
        backgroundColor: "#0C1311",
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
    }),

    placeholder: (base: any) => ({
        ...base,
        color: "#FFFFFF",
        opacity: 0.7,
    }),

    dropdownIndicator: (base: any) => ({
        ...base,
        ":hover": { color: "#2DE3A7" },
    }),

    clearIndicator: (base: any) => ({
        ...base,
        color: "#2DE3A7",
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
}: SelectInputProps) {
    const selectedOption =
        value !== null
            ? options.find((opt) => opt.value.toString() === value.toString())
            : null;

    return (
        <div>
            <Select
                inputId={id}
                name={name}
                options={options}
                value={selectedOption || null}
                onChange={(opt) => onChange(opt?.value ?? "")}
                placeholder={placeholder}
                isSearchable={isSearchable}
                styles={brandStyles}
                tabSelectsValue={false}
                blurInputOnSelect={true}
                menuPlacement="auto"
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
