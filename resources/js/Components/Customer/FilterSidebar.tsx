import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { X, SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
    };
    currentUrl: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    isOpen,
    onClose,
    filters,
    currentUrl,
}) => {
    const [minPrice, setMinPrice] = useState(filters.min_price || "");
    const [maxPrice, setMaxPrice] = useState(filters.max_price || "");
    const [sort, setSort] = useState(filters.sort || "latest");
    const [inStock, setInStock] = useState(filters.in_stock === "true");

    const applyFilters = () => {
        const params: Record<string, string> = {};

        if (filters.search) params.search = filters.search;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sort !== "latest") params.sort = sort;
        if (inStock) params.in_stock = "true";

        router.visit(currentUrl, {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });

        onClose();
    };

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setSort("latest");
        setInStock(false);

        router.visit(currentUrl, {
            data: filters.search ? { search: filters.search } : {},
            preserveState: true,
            preserveScroll: true,
        });

        onClose();
    };

    return (
        <>
        {/* Backdrop */ }
            {
        isOpen && (
            <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick = { onClose }
            />
            )}

{/* Sidebar */ }
<div
                className={
    `fixed inset-y-0 left-0 max-w-sm w-full bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
    }`
}
            >
    <div className="flex flex-col h-full" >
        {/* Header */ }
        < div className = "flex items-center justify-between p-4 border-b border-gray-200" >
            <div className="flex items-center gap-2" >
                <SlidersHorizontal className="text-gray-900" />
                    <h2 className="text-lg font-bold text-gray-900" >
                        Filters
                        </h2>
                        </div>
                        < button
onClick = { onClose }
className = "p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
    >
    <X size={ 20 } />
        </button>
        </div>

{/* Filter Content */ }
<div className="flex-1 overflow-y-auto p-4 space-y-6" >
    {/* Sort Options */ }
    < div >
    <h3 className="text-sm font-bold text-gray-900 mb-3" >
        Sort By
            </h3>
            < div className = "space-y-2" >
            {
                [
                { value: "latest", label: "Latest" },
                {
                    value: "price_low",
                    label: "Price: Low to High",
                },
                {
                    value: "price_high",
                    label: "Price: High to Low",
                },
                { value: "name", label: "Name: A to Z" },
                                ].map((option) => (
                    <label
                                        key= { option.value }
                                        className = "flex items-center gap-2 cursor-pointer"
                    >
                    <input
                                            type="radio"
                                            name = "sort"
                                            value = { option.value }
                                            checked = { sort === option.value}
onChange = {(e) =>
setSort(e.target.value)
                                            }
className = "w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
    />
    <span className="text-sm text-gray-700" >
        { option.label }
        </span>
        </label>
                                ))}
</div>
    </div>

{/* Price Range */ }
<div className="border-t border-gray-200 pt-6" >
    <h3 className="text-sm font-bold text-gray-900 mb-3" >
        Price Range
            </h3>
            < div className = "grid grid-cols-2 gap-4" >
                <div>
                <label className="block text-xs text-gray-500 mb-1" >
                    Min Price
                        </label>
                        < input
type = "number"
value = { minPrice }
onChange = {(e) =>
setMinPrice(e.target.value)
                                        }
placeholder = "0"
className = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    </div>
    < div >
    <label className="block text-xs text-gray-500 mb-1" >
        Max Price
            </label>
            < input
type = "number"
value = { maxPrice }
onChange = {(e) =>
setMaxPrice(e.target.value)
                                        }
placeholder = "10000"
className = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    </div>
    </div>
    </div>

{/* Stock Status */ }
<div className="border-t border-gray-200 pt-6" >
    <h3 className="text-sm font-bold text-gray-900 mb-3" >
        Availability
        </h3>
        < label className = "flex items-center gap-2 cursor-pointer" >
            <input
                                    type="checkbox"
checked = { inStock }
onChange = {(e) =>
setInStock(e.target.checked)
                                    }
className = "w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
    />
    <span className="text-sm text-gray-700" >
        In Stock Only
            </span>
            </label>
            </div>
            </div>

{/* Footer */ }
<div className="border-t border-gray-200 p-4 space-y-3" >
    <button
                            onClick={ applyFilters }
className = "w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
    >
    Apply Filters
        </button>
        < button
onClick = { clearFilters }
className = "w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
    >
    Clear All
        </button>
        </div>
        </div>
        </div>
        </>
    );
};

export default FilterSidebar;
