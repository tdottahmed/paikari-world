import React from "react";
import { Link } from "@inertiajs/react";
import { Edit2, Eye, Box, Package, SwatchBookIcon } from "lucide-react";
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
    const profit = formatPrice(
        (product.sale_price || 0) - (product.purchase_price || 0)
    );
    const isNew =
        new Date(product.created_at) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onEdit) {
            onEdit(product);
        } else {
            window.location.href = `/admin/products/${product.id}/edit`;
        }
    };

    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg shadow-sm hover:shadow-lg hover:border-[#2DE3A7]/30 transition-all duration-300 overflow-hidden group flex flex-col h-full relative">
            {/* Image Container */}
            <div className="relative aspect-[4/4] bg-[#F5F5F0] overflow-hidden shrink-0">
                <Image
                    src={
                        product.images && product.images.length > 0
                            ? storagePath(product.images[0])
                            : undefined
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Top Left: NEW Badge */}
                {isNew && (
                    <div className="absolute top-2 left-2 bg-[#0C1311] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        NEW
                    </div>
                )}

                {/* Top Right: Stock Badge */}
                <div className="absolute top-2 right-2 bg-[#00E3A5] text-[#0C1311] text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <SwatchBookIcon size={14} strokeWidth={2.5} />
                    <span>{product.stock}</span>
                </div>

                {/* Bottom Left: MOQ/Box Badge */}
                <div className="absolute bottom-2 left-2 bg-[#2DD4BF] text-[#0C1311] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <Box size={14} strokeWidth={2.5} />
                    <span>{formatPrice(product.moq_price || 0)}</span>
                </div>

                {/* Bottom Right: UAN/Yen Badge */}
                <div className="absolute bottom-2 right-2 bg-[#F472B6] text-[#0C1311] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-0.5">
                    <span className="text-[10px]">¥</span>
                    <span> {formatPrice(product.uan_price || 0)}</span>
                </div>

                {/* Quick Actions Overlay (Hidden by default, shown on hover) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Link
                            href={route("admin.product.show", product.id)}
                            className="p-2 bg-white text-black rounded-full hover:bg-[#2DE3A7] transition-colors"
                            title="View product"
                        >
                            <Eye size={18} />
                        </Link>
                        <button
                            onClick={handleEdit}
                            className="p-2 bg-white text-black rounded-full hover:bg-[#2DE3A7] transition-colors"
                            title="Edit product"
                        >
                            <Edit2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-[#0C1311] p-2 border-t border-[#1E2826]">
                <div className="grid grid-cols-3 gap-2 text-center">
                    {/* BUY */}
                    <div className="flex flex-col items-center border-r border-[#1E2826] text-xs md:text-sm">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                            {" "}
                            BUY{" "}
                        </span>
                        <span className="text-white font-bold">
                            {" "}
                            {product.purchase_price}{" "}
                        </span>
                    </div>

                    {/* SELL */}
                    <div className="flex flex-col items-center border-r border-[#1E2826] text-xs md:text-sm">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                            Sale
                        </span>
                        <span className="text-white font-bold">
                            {formatPrice(product.sale_price || 0)}
                        </span>
                    </div>

                    {/* PROFIT */}
                    <div className="flex flex-col items-center text-xs md:text-sm">
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                            {" "}
                            PROFIT{" "}
                        </span>
                        <span className="text-white font-bold ">
                            {" "}
                            {profit}{" "}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
