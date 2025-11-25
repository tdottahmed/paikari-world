import React, { useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, router } from "@inertiajs/react";
import ProductsGrid from "@/Components/Product/ProductsGrid";
import ProductsList from "@/Components/Product/ProductsList";
import {
    Grid3X3,
    List,
    Plus,
    Filter,
    AlertTriangle,
    XCircle,
    CheckCircle,
} from "lucide-react";
import Search from "@/Components/Ui/Search";
import { ProductsIndexProps } from "@/types";
import SelectInput from "@/Components/Ui/SelectInput";
import Pagination from "@/Components/Ui/Pagination";

const Index: React.FC<ProductsIndexProps> = ({
    products,
    categories,
    suppliers,
    stats,
    filters,
}) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);

    // Form state mirrors the current filters
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "all"
    );
    const [selectedSupplier, setSelectedSupplier] = useState(
        filters.supplier || "all"
    );
    const [sortOrder, setSortOrder] = useState(filters.sort || "newest");

    const applyFilters = () => {
        router.get(
            route("admin.products.index"),
            {
                search: searchTerm || undefined,
                category:
                    selectedCategory !== "all" ? selectedCategory : undefined,
                supplier:
                    selectedSupplier !== "all" ? selectedSupplier : undefined,
                sort: sortOrder,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleSearch = (value: string) => {
        router.get(
            route("admin.products.index"),
            {
                search: value || undefined,
                category:
                    selectedCategory !== "all" ? selectedCategory : undefined,
                supplier:
                    selectedSupplier !== "all" ? selectedSupplier : undefined,
                sort: sortOrder,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    const handleFilterChange = (filterType: string, value: string) => {
        const newFilters: any = {
            search: searchTerm || undefined,
            category: selectedCategory !== "all" ? selectedCategory : undefined,
            supplier: selectedSupplier !== "all" ? selectedSupplier : undefined,
            sort: sortOrder,
        };

        // Update the specific filter
        if (filterType === "category") {
            setSelectedCategory(value);
            newFilters.category = value !== "all" ? value : undefined;
        } else if (filterType === "supplier") {
            setSelectedSupplier(value);
            newFilters.supplier = value !== "all" ? value : undefined;
        } else if (filterType === "sort") {
            setSortOrder(value);
            newFilters.sort = value;
        }

        router.get(route("admin.products.index"), newFilters, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedSupplier("all");
        setSortOrder("newest");
        router.get(route("admin.products.index"));
    };

    return (
        <Master
            title="Products"
            head={<Header title="Products" showUserMenu={true} />}
        >
            <div className="md:p-6 space-y-6 max-w-8xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-3 md:gap-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                Products
                            </h1>
                            <p className="text-sm md:text-base text-gray-400 mt-1">
                                Manage your product inventory
                            </p>
                        </div>

                        <Link
                            href={route("admin.products.create")}
                            className="flex-shrink-0 w-full md:w-auto"
                        >
                            <PrimaryButton className="w-full md:w-auto flex items-center justify-center gap-2">
                                <Plus size={18} />
                                <span>Add Product</span>
                            </PrimaryButton>
                        </Link>
                    </div>
                    <div className="flex overflow-x-auto gap-3 pb-1 md:pb-2 text-sm no-scrollbar">
                        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-700 md:hidden">
                                    {stats.in_stock}
                                </span>
                                <span className="font-medium text-green-700 hidden md:inline">
                                    {stats.in_stock} In Stock
                                </span>
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium text-yellow-700 md:hidden">
                                    {stats.low_stock}
                                </span>
                                <span className="font-medium text-yellow-700 hidden md:inline">
                                    {stats.low_stock} Low Stock
                                </span>
                            </div>
                        </div>

                        {/* Out of Stock */}
                        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg whitespace-nowrap">
                            <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-700 md:hidden">
                                    {stats.out_of_stock}
                                </span>
                                <span className="font-medium text-red-700 hidden md:inline">
                                    {stats.out_of_stock} Out of Stock
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-grow">
                            <Search
                                value={searchTerm}
                                onChange={setSearchTerm}
                                onSubmit={handleSearch}
                                placeholder="Search products..."
                                className="w-full"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg border transition-colors flex-shrink-0 ${
                                showFilters
                                    ? "bg-emerald-50 bg-emerald-900/20 text-emerald-400"
                                    : "bg-gray-800 border-gray-700 text-gray-400"
                            }`}
                        >
                            <Filter size={20} />
                        </button>
                        <div className="hidden md:flex bg-gray-800 rounded-lg p-1 flex-shrink-0">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-gray-700 shadow-sm text-emerald-400"
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <Grid3X3 size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === "list"
                                        ? "bg-gray-700 shadow-sm text-emerald-400"
                                        : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>

                    <div
                        className={`grid transition-all duration-300 ease-in-out ${
                            showFilters
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                        <div className="overflow-hidden">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-800/50 rounded-lg mb-1">
                                <SelectInput
                                    value={sortOrder}
                                    onChange={(value) =>
                                        handleFilterChange("sort", value)
                                    }
                                    options={[
                                        {
                                            value: "newest",
                                            label: "Newest First",
                                        },
                                        {
                                            value: "oldest",
                                            label: "Oldest First",
                                        },
                                        {
                                            value: "price_low",
                                            label: "Price: Low to High",
                                        },
                                        {
                                            value: "price_high",
                                            label: "Price: High to Low",
                                        },
                                    ]}
                                    className="w-full"
                                />
                                <SelectInput
                                    value={selectedCategory}
                                    onChange={(value) =>
                                        handleFilterChange("category", value)
                                    }
                                    options={[
                                        {
                                            value: "all",
                                            label: "All Categories",
                                        },
                                        ...categories.map((c) => ({
                                            value: c.id.toString(),
                                            label: c.title,
                                        })),
                                    ]}
                                    className="w-full"
                                />
                                <SelectInput
                                    value={selectedSupplier}
                                    onChange={(value) =>
                                        handleFilterChange("supplier", value)
                                    }
                                    options={[
                                        {
                                            value: "all",
                                            label: "All Suppliers",
                                        },
                                        ...suppliers.map((s) => ({
                                            value: s.id.toString(),
                                            label: s.name,
                                        })),
                                    ]}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                <div className="mt-6">
                    {products.data.length > 0 ? (
                        viewMode === "grid" ? (
                            <ProductsGrid products={products.data} />
                        ) : (
                            <ProductsList products={products.data} />
                        )
                    ) : (
                        <div className="text-center py-12 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                            <p className="text-gray-400">
                                {" "}
                                No products found matching your filters.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-2 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination data={products} />

                {/* Bottom Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-800">
                    <div>
                        Showing {products.from || 0} to {products.to || 0} of{" "}
                        {products.total} products
                        {stats.total !== products.total &&
                            ` (${stats.total} total in inventory)`}
                    </div>
                </div>
            </div>
        </Master>
    );
};

export default Index;
