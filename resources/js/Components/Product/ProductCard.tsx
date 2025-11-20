import React from "react";
import { Link } from "@inertiajs/react";

interface Product {
    id: number;
    name: string;
    description: string;
    images: string[];
    purchase_price: number;
    sale_price: number;
    stock: number;
    // Add other fields as needed
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    console.log(product);

    const profit = product.sale_price - product.purchase_price;
    const profitPercentage = ((profit / product.purchase_price) * 100).toFixed(
        1
    );

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100">
                <img
                    src={
                        product.images && product.images.length > 0
                            ? `/storage/${product.images[0]}`
                            : "/images/placeholder-product.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Stock Badge */}
                <div
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : product.stock > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 h-14">
                    {product.name}
                </h3>

                {/* Product Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                    {product.description}
                </p>

                {/* Price Information */}
                <div className="space-y-2 border-t border-gray-100 pt-3">
                    {/* purchase Price */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                            purchase
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                            ¥{product.purchase_price.toFixed(2)}
                        </span>
                    </div>

                    {/* Sell Price */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                            SELL
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                            ¥{product.sale_price.toFixed(2)}
                        </span>
                    </div>

                    {/* Profit */}
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                            PROFIT
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-blue-600">
                                ¥{profit.toFixed(2)}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                {profitPercentage}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <Link
                        href={route("admin.product.edit", product.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm font-medium transition-colors"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => {
                            // Add delete functionality here
                            if (
                                confirm(
                                    "Are you sure you want to delete this product?"
                                )
                            ) {
                                // Handle delete
                            }
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
