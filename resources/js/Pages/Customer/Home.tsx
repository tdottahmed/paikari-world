import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Hero from "@/Components/Customer/Hero";
import CategorySlider from "@/Components/Customer/CategorySlider";
import ProductGrid from "@/Components/Customer/ProductGrid";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import { Category, Product, PaginatedData } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductFilters from "@/Components/Customer/ProductFilters";

interface HomeProps {
    categories: Category[];
    products: PaginatedData<Product>;
    website_settings?: {
        banner_images: string[];
        banner_active: boolean;
    };
    category?: Category;
    filters?: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
        is_preorder?: string;
    };
}

const Home: React.FC<HomeProps> = ({
    categories,
    products,
    website_settings,
    filters = {},
    category,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sort, setSort] = useState(filters.sort || "latest");

    // Debounced Sort Effect
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (sort !== (filters.sort || "latest")) {
                const params: Record<string, string> = {};
                if (filters.search) params.search = filters.search;
                if (filters.min_price) params.min_price = filters.min_price;
                if (filters.max_price) params.max_price = filters.max_price;
                if (sort && sort !== "latest") params.sort = sort;
                if (filters.is_preorder)
                    params.is_preorder = filters.is_preorder;

                const currentUrl = category
                    ? route("products.category", category.slug)
                    : route("home");

                router.visit(currentUrl, {
                    data: params,
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [sort, filters]);

    const currentUrl = category
        ? route("products.category", category.slug)
        : route("home");

    return (
        <CustomerLayout>
            <Head title={category ? category.title : "Home"} />
            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                currentUrl={currentUrl}
            />
            {/* Hero Section */}
            <Hero
                bannerImages={
                    website_settings?.banner_active
                        ? website_settings.banner_images
                        : []
                }
            />
            {/* Categories */}
            <div className="bg-white border-b border-gray-100">
                <CategorySlider
                    categories={categories}
                    activeCategory={category}
                />
            </div>

            {/* Search and Filters Section */}
            <ProductFilters
                sort={sort}
                setSort={setSort}
                setIsFilterOpen={setIsFilterOpen}
                filters={filters}
                togglePreorder={() => {
                    const params: Record<string, string> = {};
                    if (filters.search) params.search = filters.search;
                    if (filters.min_price) params.min_price = filters.min_price;
                    if (filters.max_price) params.max_price = filters.max_price;
                    if (sort && sort !== "latest") params.sort = sort;
                    if (filters.in_stock) params.in_stock = filters.in_stock;

                    // Toggle preorder
                    if (filters.is_preorder === "true") {
                        delete params.is_preorder;
                    } else {
                        params.is_preorder = "true";
                    }

                    router.visit(currentUrl, {
                        data: params,
                        preserveState: true,
                        preserveScroll: false,
                        replace: true,
                        only: ["products", "filters"],
                        onSuccess: () => {
                            document
                                .getElementById("products-section")
                                ?.scrollIntoView({ behavior: "smooth" });
                        },
                    });
                }}
            />

            {/* Products */}
            <div
                className="bg-gray-50 min-h-screen py-2 md:py-6"
                id="products-section"
            >
                <ProductGrid products={products} />
            </div>
        </CustomerLayout>
    );
};

export default Home;
