import React, { useRef, useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { ShoppingCart } from "lucide-react";
import { storagePath } from "@/Utils/helpers";
import { Product } from "@/types";
import Image from "../Ui/Image";
import axios from "axios";

interface ProductGridProps {
    products: {
        data: Product[];
        links: any[];
        next_page_url?: string | null;
    };
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const [allProducts, setAllProducts] = useState<Product[]>(
        products?.data || []
    );
    const [nextPageUrl, setNextPageUrl] = useState(products?.next_page_url);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setAllProducts(products?.data || []);
        setNextPageUrl(products?.next_page_url);
        setError(null);
    }, [products]);

    // Infinite scroll implementation
    useEffect(() => {
        if (!loadMoreRef.current || !nextPageUrl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !isLoading && nextPageUrl) {
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
    }, [nextPageUrl, isLoading]);

    const loadMore = async () => {
        if (!nextPageUrl || isLoading) return;

        setIsLoading(true);
        setError(null);
        console.log("Loading more products from:", nextPageUrl);

        try {
            const response = await axios.get(nextPageUrl, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Inertia": "true",
                    "X-Inertia-Version": window.history.state?.version || "",
                    Accept: "application/json",
                },
                timeout: 10000, // 10 second timeout
            });

            const data = response.data;
            console.log("Load more response:", data);

            // Check if data has the expected structure
            if (!data || !data.props || !data.props.products) {
                console.error("Unexpected response structure:", data);
                throw new Error("Unexpected response format");
            }

            const newProducts = data.props.products;

            if (newProducts && Array.isArray(newProducts.data)) {
                setAllProducts((prev) => [...prev, ...newProducts.data]);
                setNextPageUrl(newProducts.next_page_url);
            } else {
                throw new Error("Invalid products data structure");
            }
        } catch (error: any) {
            console.error("Failed to load more products:", error);

            let errorMessage = "Failed to load more products";

            if (axios.isAxiosError(error)) {
                if (error.code === "ECONNABORTED") {
                    errorMessage = "Request timeout. Please try again.";
                } else if (error.response) {
                    // Server responded with error status
                    if (error.response.status === 404) {
                        errorMessage = "Products not found.";
                    } else if (error.response.status === 500) {
                        errorMessage = "Server error. Please try again later.";
                    } else {
                        errorMessage = `Server error: ${error.response.status}`;
                    }
                } else if (error.request) {
                    // Request made but no response received
                    errorMessage =
                        "Network error. Please check your connection.";
                }
            } else {
                errorMessage = error?.message || "Failed to load more products";
            }

            setError(errorMessage);
            setNextPageUrl(null); // Stop infinite scroll on error
        } finally {
            setIsLoading(false);
        }
    };

    // Retry loading more products
    const handleRetry = () => {
        if (nextPageUrl) {
            setError(null);
            loadMore();
        }
    };

    const addToCart = (product: Product) => {
        router.post(
            route("cart.store"),
            {
                product_id: product.id,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Dispatch event to open cart sidebar
                    window.dispatchEvent(new CustomEvent("open-cart"));
                },
            }
        );
    };

    if (!products || !products.data) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg
                                className="h-5 w-5 text-red-400 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-red-800 text-sm">
                                {error}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {nextPageUrl && (
                                <button
                                    onClick={handleRetry}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                                >
                                    Retry
                                </button>
                            )}
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {allProducts.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                            {product.stock > 0 ? (
                                <span className="absolute top-2 left-2 z-10 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    In Stock
                                </span>
                            ) : (
                                <span className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Out of Stock
                                </span>
                            )}

                            <Link href={route("products.show", product.slug)}>
                                <Image
                                    src={storagePath(product.images?.[0])}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>

                            {/* Quick Add Button (Visible on Hover) */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                }}
                                className="absolute bottom-3 right-3 p-2 bg-white text-gray-900 rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-900 hover:text-white"
                            >
                                <ShoppingCart size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                            <Link
                                href={route("products.show", product.slug)}
                                className="block"
                            >
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">
                                        {product.category?.title}
                                    </span>
                                    <span className="text-lg font-bold text-gray-900">
                                        ৳{product.sale_price}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading Indicator */}
            {nextPageUrl && (
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
            {!nextPageUrl && allProducts.length > 0 && (
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
