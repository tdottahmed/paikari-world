import React from "react";
import { Link } from "@inertiajs/react";
import { Edit2, Eye } from "lucide-react";
import { storagePath, formatPrice } from "@/Utils/helpers";
import { Product } from "@/types";
import Image from "../Ui/Image";

interface ProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
    onDelete?: (product: Product) => void;
    onView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
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

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onEdit) {
            onEdit(product);
        } else {
            window.location.href = `/admin/products/${product.id}/edit`;
        }
    };

    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg shadow-sm hover:shadow-lg hover:border-[#2DE3A7]/30 transition-all duration-300 overflow-hidden group flex flex-col h-full">
            <div className="relative aspect-[4/3] bg-[#0F1A18] overflow-hidden shrink-0">
                <Image
                    src={
                        product.images && product.images.length > 0
                            ? storagePath(product.images[0])
                            : undefined
                    }
                    alt={product.name}
                />

                {/* Stock Indicator */}
                <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${stockVariant.bg} ${stockVariant.color} ${stockVariant.border} border backdrop-blur-sm`}
                >
                    {product.stock} in stock
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-[#0C1311] bg-opacity-0 group-hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Link
                            href={route("admin.product.show", product.id)}
                            className="p-3 bg-[#2DE3A7] text-[#0C1311] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                            title="View product"
                        >
                            <Eye size={18} />
                        </Link>
                        <Link
                            href={route("admin.product.edit", product.id)}
                            className="p-3 bg-[#2DE3A7] text-[#0C1311] rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                            title="Edit product"
                        >
                            <Edit2 size={18} />
                        </Link>
                    </div>
                </div>

                {/* Profit Badge */}
                <div className="absolute top-3 left-3 bg-[#2DE3A7] text-[#0C1311] px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                    +{profitPercentage} %
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Product Name */}
                <h3 className="font-semibold text-white text-base mb-3 line-clamp-2 leading-tight min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Price & Stock Info */}
                <div className="space-y-2 mb-4">
                    {/* Purchase Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400"> Cost: </span>
                        <span className="text-sm font-medium text-gray-300">
                            {formatPrice(product.purchase_price)}
                        </span>
                    </div>

                    {/* Sale Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400"> Price: </span>
                        <span className="text-sm font-semibold text-[#2DE3A7]">
                            {formatPrice(product.sale_price)}
                        </span>
                    </div>

                    {/* Profit */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1E2826]">
                        <span className="text-sm text-gray-400"> Profit: </span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#2DE3A7]">
                                {formatPrice(profit)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
