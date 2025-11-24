import React, { useRef, useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { ShoppingCart } from "lucide-react";
import { storagePath } from "@/Utils/helpers";
import { Product } from "@/types";
import Image from "../Ui/Image";

interface ProductGridProps {
    products: {
        data: Product[];
        links: any[];
        next_page_url?: string | null;
    };
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const [allProducts, setAllProducts] = useState<Product[]>(products?.data || []);
    const [nextPageUrl, setNextPageUrl] = useState(products?.next_page_url);
    const [isLoading, setIsLoading] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Reset products when products prop changes (e.g., filter/search applied)
    useEffect(() => {
        setAllProducts(products?.data || []);
        setNextPageUrl(products?.next_page_url);
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

        try {
            const response = await fetch(nextPageUrl, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Inertia": "true",
                    "X-Inertia-Version": window.history.state?.version || "",
                    Accept: "application/json",
                },
            });

            const data = await response.json();

            if (data.props?.products) {
                setAllProducts((prev) => [
                    ...prev,
                    ...data.props.products.data,
                ]);
                setNextPageUrl(data.props.products.next_page_url);
            }
        } catch (error) {
            console.error("Failed to load more products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!products || !products.data) return null;

    return (
        <div className= "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >
        {/* Product Grid */ }
        < div className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" >
            {
                allProducts.map((product) => (
                    <div
                        key= { product.id }
                        className = "group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                    {/* Image Container */ }
                    < div className = "relative aspect-square bg-gray-100 overflow-hidden" >
                    {
                        product.stock > 0 ? (
                            <span className= "absolute top-2 left-2 z-10 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full" >
                            In Stock
                            </ span >
                            ) : (
                                <span className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full" >
                            Out of Stock
                            </span>
                            )
}

<Link href={ route("products.show", product.slug) }>
    <Image
                                    src={ storagePath(product.images?.[0]) }
alt = { product.name }
className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    </Link>

{/* Quick Add Button (Visible on Hover) */ }
<button className="absolute bottom-3 right-3 p-2 bg-white text-gray-900 rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-900 hover:text-white" >
    <ShoppingCart size={ 18 } />
        </button>
        </div>

{/* Content */ }
<div className="p-4 flex-1 flex flex-col" >
    <Link
                                href={ route("products.show", product.slug) }
className = "block"
    >
    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors" >
        { product.name }
        </h3>
        </Link>

        < div className = "mt-auto pt-2 flex items-center justify-between" >
            <div className="flex flex-col" >
                <span className="text-xs text-gray-500" >
                    { product.category?.title }
                    </span>
                    < span className = "text-lg font-bold text-gray-900" >
                                        ৳{ product.sale_price }
</span>
    </div>
    </div>
    </div>
    </div>
                ))}
</div>

{/* Loading Indicator */ }
{
    nextPageUrl && (
        <div ref={ loadMoreRef } className = "mt-8 text-center" >
            {
                isLoading?(
                        <div className = "inline-flex items-center gap-2 text-gray-500" >
                        <svg
                                className="animate-spin h-5 w-5"
                    viewBox = "0 0 24 24"
                        >
                        <circle
                                    className="opacity-25"
                    cx = "12"
                                    cy = "12"
                                    r = "10"
                                    stroke = "currentColor"
                                    strokeWidth = "4"
                                    fill = "none"
                        />
                        <path
                                    className="opacity-75"
                    fill = "currentColor"
                                    d = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                        </svg>
                        < span > Loading more products...</ span >
            </div>
                    ) : (
        <div className= "text-sm text-gray-400" >
        Scroll to load more
            </div>
                    )
}
</div>
            )}

{/* No more products message */ }
{
    !nextPageUrl && allProducts.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-400" >
            You've reached the end
                </div>
            )
}

{/* Empty state */ }
{
    allProducts.length === 0 && (
        <div className="mt-12 text-center py-12" >
            <p className="text-gray-500" > No products found </p>
                </div>
            )
}
</div>
    );
};

export default ProductGrid;

