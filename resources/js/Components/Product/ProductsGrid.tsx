import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { Plus } from "lucide-react";

interface ProductsGridProps {
    products: Product[];
    isLoading?: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
    products,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden animate-pulse"
                    >
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                            <div className="space-y-2 pt-3">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between"
                                    >
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    📦
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Get started by creating your first product to manage your
                    inventory and sales.
                </p>
                <a
                    href={route("admin.products.create")}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 border border-transparent rounded-xl font-semibold text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                >
                    <Plus size={18} />
                    Add Your First Product
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductsGrid;
