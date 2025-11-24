import React from "react";
import { Link } from "@inertiajs/react";
import { Filter, ShoppingCart } from "lucide-react";
import { Product } from "@/types"; // Assuming Product type exists

interface ProductGridProps {
    products: {
        data: Product[];
        links: any[]; // Pagination links
    };
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    if (!products || !products.data) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters & Sorting Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                        <Filter size={16} />
                        <span> Sorting </span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                        <span>Stock - outs </span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        Showing {products.data.length} products
                    </span>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.data.map((product) => (
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

                            {/* New Badge (Mock logic) */}
                            <span className="absolute top-2 right-2 z-10 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                NEW
                            </span>

                            <Link href={`/product/${product.slug}`}>
                                <img
                                    src={
                                        product.images &&
                                        product.images.length > 0
                                            ? `/storage/${product.images[0]}`
                                            : "/placeholder-product.png"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>

                            {/* Quick Add Button (Visible on Hover) */}
                            <button className="absolute bottom-3 right-3 p-2 bg-white text-gray-900 rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-900 hover:text-white">
                                <ShoppingCart size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                            <Link
                                href={`/product/${product.slug}`}
                                className="block"
                            >
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">
                                        {" "}
                                        {product.category?.title}{" "}
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

            {/* Pagination (Simple placeholder for now) */}
            {products.links && products.links.length > 3 && (
                <div className="mt-12 flex justify-center">
                    <div className="flex gap-1">
                        {products.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || "#"}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                    link.active
                                        ? "bg-gray-900 text-white"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                } ${
                                    !link.url && "opacity-50 cursor-not-allowed"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGrid;
