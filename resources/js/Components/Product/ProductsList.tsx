import React from "react";
import { Link } from "@inertiajs/react";
import { Edit2, Eye, Package, TrendingUp } from "lucide-react";
import { storagePath, formatPrice } from "@/Utils/helpers";
import { Product } from "@/types";
import Image from "../Ui/Image";

interface ProductsListProps {
    products: Product[];
    isLoading?: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({
    products,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 rounded-lg border border-gray-700 p-4 animate-pulse"
                    >
                        <div className="flex gap-4">
                            <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0">
                                {" "}
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="h-5 bg-gray-700 rounded w-2/3">
                                    {" "}
                                </div>
                                <div className="h-4 bg-gray-700 rounded w-1/2">
                                    {" "}
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-4 bg-gray-700 rounded w-20">
                                        {" "}
                                    </div>
                                    <div className="h-4 bg-gray-700 rounded w-20">
                                        {" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12 px-4 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                <div className="text-gray-300 text-5xl mb-3">📦</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                    No products yet
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    Start by adding your first product to the inventory
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {products.map((product) => (
                <ProductListItem key={product.id} product={product} />
            ))}
        </div>
    );
};

interface ProductListItemProps {
    product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
    const profit = product.sale_price - product.purchase_price;
    const profitPercentage = ((profit / product.purchase_price) * 100).toFixed(
        1
    );

    const getStockVariant = (stock: number) => {
        if (stock > 15)
            return {
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
                border: "border-emerald-400/20",
            };
        if (stock > 5)
            return {
                color: "text-amber-400",
                bg: "bg-amber-400/10",
                border: "border-amber-400/20",
            };
        return {
            color: "text-red-400",
            bg: "bg-red-400/10",
            border: "border-red-400/20",
        };
    };

    const stockVariant = getStockVariant(product.stock);

    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg hover:border-[#2DE3A7]/30 transition-all duration-200 overflow-hidden group">
            <div className="p-4">
                <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-[#0F1A18] rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src={
                                product.images && product.images.length > 0
                                    ? storagePath(product.images[0])
                                    : undefined
                            }
                            alt={product.name}
                        />
                        {/* Profit Badge */}
                        <div className="absolute top-1 left-1 bg-[#2DE3A7] text-[#0C1311] px-1.5 py-0.5 rounded text-xs font-bold">
                            +{profitPercentage} %
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base mb-1 line-clamp-1">
                                    {product.name}
                                </h3>
                                {product.sku && (
                                    <p className="text-xs text-gray-500">
                                        SKU: {product.sku}
                                    </p>
                                )}
                            </div>

                            {/* Stock Badge */}
                            <div
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stockVariant.bg} ${stockVariant.color} ${stockVariant.border} border whitespace-nowrap`}
                            >
                                <Package size={12} />
                                <span> {product.stock} in stock </span>
                            </div>
                        </div>

                        {/* Pricing Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            {/* Purchase Price */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <div className="text-xs text-gray-500 mb-0.5">
                                    Cost
                                </div>
                                <div className="text-sm font-medium text-gray-300">
                                    {formatPrice(product.purchase_price)}
                                </div>
                            </div>

                            {/* Sale Price */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <div className="text-xs text-gray-500 mb-0.5">
                                    Price
                                </div>
                                <div className="text-sm font-semibold text-[#2DE3A7]">
                                    {formatPrice(product.sale_price)}
                                </div>
                            </div>

                            {/* Profit */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <div className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                                    <TrendingUp size={10} />
                                    Profit
                                </div>
                                <div className="text-sm font-bold text-[#2DE3A7]">
                                    {formatPrice(profit)}
                                </div>
                            </div>

                            {/* Category */}
                            {product.category && (
                                <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                    <div className="text-xs text-gray-500 mb-0.5">
                                        Category
                                    </div>
                                    <div className="text-sm font-medium text-gray-300 truncate">
                                        {product.category.title}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.product.show", product.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2826] text-gray-300 rounded-lg text-sm hover:bg-[#2A3633] hover:text-white transition-colors border border-[#2A3633]"
                            >
                                <Eye size={14} />
                                <span> View </span>
                            </Link>
                            <Link
                                href={route("admin.product.edit", product.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2DE3A7]/10 text-[#2DE3A7] rounded-lg text-sm hover:bg-[#2DE3A7]/20 transition-colors border border-[#2DE3A7]/30"
                            >
                                <Edit2 size={14} />
                                <span> Edit </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsList;
