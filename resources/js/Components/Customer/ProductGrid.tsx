import React, { useRef, useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";

interface ProductGridProps {
    products: {
        data: Product[];
        links: any[];
        next_page_url?: string | null;
        current_page: number;
        last_page: number;
    };
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const [allProducts, setAllProducts] = useState<Product[]>(
        products?.data || []
    );
    const [nextPage, setNextPage] = useState<number | null>(
        products?.current_page < products?.last_page
            ? products.current_page + 1
            : null
    );
    const [isLoading, setIsLoading] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const accumulatedProductsRef = useRef<Product[]>(products?.data || []);

    // Reset products when the initial products prop changes (e.g., after filtering)
    useEffect(() => {
        // Only reset if it's actually a new search/filter (page 1) or if the data completely changed
        if (products?.current_page === 1) {
            setAllProducts(products?.data || []);
            accumulatedProductsRef.current = products?.data || [];
            setNextPage(
                products?.current_page < products?.last_page
                    ? products.current_page + 1
                    : null
            );
        }
    }, [products]);

    // Infinite scroll observer
    useEffect(() => {
        if (!loadMoreRef.current || !nextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !isLoading && nextPage) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [nextPage, isLoading]);

    const loadMore = () => {
        if (isLoading || !nextPage) return;

        setIsLoading(true);

        // Get current URL search params
        const currentParams = new URLSearchParams(window.location.search);

        // Create new URLSearchParams with page parameter
        const params: Record<string, any> = {};
        currentParams.forEach((value, key) => {
            params[key] = value;
        });
        params.page = nextPage;

        router.get(window.location.pathname, params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ["products"],
            onSuccess: (page) => {
                const newProducts = page.props.products as typeof products;
                const updatedProducts = [
                    ...accumulatedProductsRef.current,
                    ...newProducts.data,
                ];

                accumulatedProductsRef.current = updatedProducts;
                setAllProducts(updatedProducts);

                setNextPage(
                    newProducts.current_page < newProducts.last_page
                        ? newProducts.current_page + 1
                        : null
                );

                setIsLoading(false);
            },
            onError: (errors) => {
                console.error("Failed to load more products:", errors);
                setIsLoading(false);
            },
        });
    };

    if (!products || !products.data) return null;

    return (
        <div className="max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4 sm:gap-6">
                {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {nextPage && (
                <div ref={loadMoreRef} className="mt-8 text-center">
                    {isLoading ? (
                        <div className="inline-flex items-center gap-2 text-gray-500">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600">
                                {" "}
                            </div>
                            <span> Loading more products...</span>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-400">
                            Scroll to load more
                        </div>
                    )}
                </div>
            )}

            {/* No more products message */}
            {!nextPage && allProducts.length > 0 && (
                <div className="mt-8 text-center text-sm text-gray-400">
                    You've reached the end
                </div>
            )}

            {/* Empty state */}
            {allProducts.length === 0 && (
                <div className="mt-12 text-center py-12">
                    <div className="max-w-md mx-auto">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No products found
                        </h3>
                        <p className="mt-2 text-gray-500">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
