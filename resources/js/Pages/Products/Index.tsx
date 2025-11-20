import React, { useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link } from "@inertiajs/react";
import ProductsGrid from "@/Components/Product/ProductsGrid";
import {
    BookOpen,
    Filter,
    Grid3X3,
    List,
    Plus,
    Settings,
    Store,
    Upload,
    Download,
} from "lucide-react";
import Search from "@/Components/Ui/Search";
import { Product, ProductsIndexProps } from "@/types";

const Index: React.FC<ProductsIndexProps> = ({ products }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Calculate stats for the header
    const totalProducts = products.length;
    const inStockCount = products.filter((p) => p.stock > 0).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;
    const lowStockCount = products.filter(
        (p) => p.stock > 0 && p.stock <= 10
    ).length;

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        // Implement search logic here or pass to parent
        console.log("Searching for:", value);
    };

    const handleExport = () => {
        // Implement export functionality
        console.log("Exporting products...");
    };

    const handleImport = () => {
        console.log("Importing products...");
    };

    return (
        <Master
            title="Products"
            head={<Header title="Products" showUserMenu={true} />}
        >
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Products
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage your product inventory, pricing, and
                            variations
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-green-700 dark:text-green-300">
                                {inStockCount} In Stock
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <span className="font-medium text-yellow-700 dark:text-yellow-300">
                                {lowStockCount} Low Stock
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="font-medium text-red-700 dark:text-red-300">
                                {outOfStockCount} Out of Stock
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    {/* Left Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Link href={route("admin.products.create")}>
                            <PrimaryButton className="flex items-center gap-2">
                                <Plus size={18} />
                                <span>Add Product</span>
                            </PrimaryButton>
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleImport}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Upload size={16} />
                                <span>Import</span>
                            </button>

                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Download size={16} />
                                <span>Export</span>
                            </button>

                            <button className="p-2 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Controls */}
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === "grid"
                                        ? "bg-white dark:bg-gray-700 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-colors ${
                                    viewMode === "list"
                                        ? "bg-white dark:bg-gray-700 shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="w-full lg:w-64">
                            <Search
                                value={searchTerm}
                                onChange={setSearchTerm}
                                onSubmit={handleSearch}
                                placeholder="Search products..."
                            />
                        </div>
                    </div>
                </div>

                {/* Products Grid/List */}
                <div className="mt-6">
                    {viewMode === "grid" ? (
                        <ProductsGrid products={products} />
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            {/* List view implementation would go here */}
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                List view coming soon...
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Pagination/Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                        Showing{" "}
                        <span className="font-medium">{products.length}</span>{" "}
                        of{" "}
                        <span className="font-medium">{products.length}</span>{" "}
                        products
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Master>
    );
};

export default Index;
