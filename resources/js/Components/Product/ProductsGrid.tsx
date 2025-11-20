import React from "react";
import { Edit2, Trash2, Eye, MoreVertical } from "lucide-react";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import DangerButton from "@/Components/Actions/DangerButton";

interface Product {
    id: number;
    name: string;
    images: string[];
    purchase_price: number;
    sale_price: number;
    stock: number;
    category?: string;
}

interface ProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    onView?: (product: Product) => void;
    variant?: "grid" | "list";
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onEdit,
    onDelete,
    onView,
    variant = "grid",
}) => {
    const profit = product.sale_price - product.purchase_price;
    const profitPercentage = ((profit / product.purchase_price) * 100).toFixed(
        1
    );

    const getStockVariant = (stock: number) => {
        if (stock > 15) return "text-emerald-400 bg-emerald-400/10";
        if (stock > 5) return "text-amber-400 bg-amber-400/10";
        return "text-red-400 bg-red-400/10";
    };

    const stockVariant = getStockVariant(product.stock);

    if (variant === "list") {
        return (
            <div className="flex items-center gap-4 p-4 bg-[#0E1614] border border-[#1E2826] rounded-lg hover:border-[#2DE3A7]/30 transition-all duration-200 group">
                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-[#0F1A18] rounded-lg overflow-hidden">
                    <img
                        src={
                            product.images && product.images.length > 0
                                ? `/storage/${product.images[0]}`
                                : "/images/placeholder-product.jpg"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate mb-1">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>
                            Cost: ৳{product.purchase_price.toLocaleString()}
                        </span>
                        <span>
                            Price: ৳{product.sale_price.toLocaleString()}
                        </span>
                        <span className="text-[#2DE3A7] font-medium">
                            Profit: ৳{profit.toLocaleString()} (
                            {profitPercentage}%)
                        </span>
                    </div>
                </div>

                {/* Stock & Actions */}
                <div className="flex items-center gap-3">
                    <div
                        className={`px-2 py-1 rounded text-xs font-medium ${stockVariant}`}
                    >
                        {product.stock} in stock
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <PrimaryButton
                            onClick={() => onView?.(product)}
                            size="sm"
                            variant="ghost"
                            className="p-1"
                        >
                            <Eye size={14} />
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => onEdit?.(product)}
                            size="sm"
                            variant="ghost"
                            className="p-1"
                        >
                            <Edit2 size={14} />
                        </PrimaryButton>
                        <DangerButton
                            onClick={() => onDelete?.(product)}
                            size="sm"
                            variant="ghost"
                            className="p-1"
                        >
                            <Trash2 size={14} />
                        </DangerButton>
                    </div>
                </div>
            </div>
        );
    }

    // Default grid variant
    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg hover:border-[#2DE3A7]/30 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Product Image */}
            <div className="relative aspect-square bg-[#0F1A18] overflow-hidden">
                <img
                    src={
                        product.images && product.images.length > 0
                            ? `/storage/${product.images[0]}`
                            : "/images/placeholder-product.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="bg-[#2DE3A7] text-[#0C1311] px-2 py-1 rounded-full text-xs font-bold">
                        +{profitPercentage}%
                    </div>
                    <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${stockVariant} backdrop-blur-sm`}
                    >
                        {product.stock}
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-[#0C1311] bg-opacity-0 group-hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <PrimaryButton
                            onClick={() => onView?.(product)}
                            size="sm"
                            className="rounded-full p-2"
                        >
                            <Eye size={16} />
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => onEdit?.(product)}
                            size="sm"
                            className="rounded-full p-2"
                        >
                            <Edit2 size={16} />
                        </PrimaryButton>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 leading-tight h-10">
                    {product.name}
                </h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Cost:</span>
                        <span className="text-gray-300">
                            ৳{product.purchase_price.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-[#2DE3A7] font-semibold">
                            ৳{product.sale_price.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[#1E2826]">
                        <span className="text-gray-400">Profit:</span>
                        <span className="text-[#2DE3A7] font-bold">
                            ৳{profit.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-[#1E2826]">
                    <PrimaryButton
                        onClick={() => onEdit?.(product)}
                        size="sm"
                        className="flex-1 text-xs"
                        variant="outline"
                        fullWidth
                        as="button"
                        type="button"
                    >
                        Edit
                    </PrimaryButton>
                    <DangerButton
                        size="sm"
                        className="flex-1 text-xs"
                        variant="ghost"
                        type="button"
                        onClick={() => onDelete?.(product)}
                    >
                        Delete
                    </DangerButton>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
