import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Hero from "@/Components/Customer/Hero";
import CategorySlider from "@/Components/Customer/CategorySlider";
import ProductGrid from "@/Components/Customer/ProductGrid";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import { Category, Product, PaginatedData } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

interface HomeProps {
    categories: Category[];
    products: PaginatedData<Product>;
    filters?: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
    };
}

const Home: React.FC<HomeProps> = ({ categories, products, filters = {} }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (filters.min_price) params.min_price = filters.min_price;
        if (filters.max_price) params.max_price = filters.max_price;
        if (filters.sort && filters.sort !== "latest")
            params.sort = filters.sort;
        if (filters.in_stock) params.in_stock = filters.in_stock;

        router.visit(route("home"), {
            data: params,
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <CustomerLayout>
            <Head title="Home" />
            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                currentUrl={route("home")}
            />
            {/* Hero Section */}
            <Hero />
            {/* Categories */}
            <div className="bg-white border-b border-gray-100">
                <CategorySlider categories={categories} />
            </div>

            {/* Search and Filters Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Products
                        </h2>
                        {/* Search and Filter Controls */}
                        <div className="flex gap-2 items-center">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 sm:flex-initial"
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search products..."
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                </div>
                            </form>
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <SlidersHorizontal size={18} />
                                <span className="hidden sm:inline">
                                    {" "}
                                    Filters{" "}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(filters.search ||
                        filters.min_price ||
                        filters.max_price ||
                        filters.in_stock ||
                        (filters.sort && filters.sort !== "latest")) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {filters.search && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Search: {filters.search}
                                </span>
                            )}
                            {filters.min_price && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Min: ৳{filters.min_price}
                                </span>
                            )}
                            {filters.max_price && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Max: ৳{filters.max_price}
                                </span>
                            )}
                            {filters.in_stock === "true" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    In Stock Only
                                </span>
                            )}
                            {filters.sort && filters.sort !== "latest" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Sort:{" "}
                                    {filters.sort === "price_low"
                                        ? "Price Low to High"
                                        : filters.sort === "price_high"
                                        ? "Price High to Low"
                                        : "Name A-Z"}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Products */}
            <div className="bg-gray-50 min-h-screen">
                <ProductGrid products={products} />
            </div>
        </CustomerLayout>
    );
};

export default Home;
