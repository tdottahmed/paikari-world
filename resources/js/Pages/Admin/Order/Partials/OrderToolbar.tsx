import Search from "@/Components/Ui/Search";
import SelectInput from "@/Components/Ui/SelectInput";
import ViewToggle from "@/Components/Order/ViewToggle";

interface Props {
    search: string;
    setSearch: (value: string) => void;
    filters: {
        status?: string;
    };
    filterStatusOptions: { value: string; label: string }[];
    handleStatusChange: (status: string) => void;
    viewMode: "grid" | "list";
    handleViewModeChange: (mode: "grid" | "list") => void;
}

export default function OrderToolbar({
    search,
    setSearch,
    filters,
    filterStatusOptions,
    handleStatusChange,
    viewMode,
    handleViewModeChange,
}: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
            <Search
                value={search}
                onChange={setSearch}
                placeholder="Search orders..."
                className="w-full md:w-64"
            />

            <div className="w-full md:w-48">
                <SelectInput
                    value={filters.status || "all"}
                    options={filterStatusOptions}
                    onChange={handleStatusChange}
                    placeholder="Filter Status"
                />
            </div>

            <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
        </div>
    );
}
