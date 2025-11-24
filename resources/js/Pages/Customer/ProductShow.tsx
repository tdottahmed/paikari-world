import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Product } from "@/types";
import {
    ShoppingCart,
    Heart,
    Share2,
    ChevronRight,
    Minus,
    Plus,
} from "lucide-react";
import Image from "@/Components/Ui/Image";
import { storagePath } from "@/Utils/helpers";

interface ProductShowProps {
    product: Product;
}

const ProductShow: React.FC<ProductShowProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(
        product.images && product.images.length > 0 ? product.images[0] : null
    );

    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (type === "increment") {
            setQuantity((prev) => prev + 1);
        } else if (type === "decrement" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <CustomerLayout>
            <Head title={product.name} />

            <div className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-gray-900">
                            Home
                        </Link>
                        <ChevronRight size={16} className="mx-2" />
                        <Link
                            href={route("products.index")}
                            className="hover:text-gray-900"
                        >
                            Products
                        </Link>
                        {product.category && (
                            <>
                                <ChevronRight size={16} className="mx-2" />
                                <Link
                                    href={route(
                                        "products.category",
                                        product.category.slug
                                    )}
                                    className="hover:text-gray-900"
                                >
                                    {product.category.title}
                                </Link>
                            </>
                        )}
                        <ChevronRight size={16} className="mx-2" />
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {product.name}
                        </span>
                    </nav>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-8">
                            {/* Image Gallery */}
                            <div className="space-y-4">
                                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                                    <Image
                                        src={storagePath(product.images[0])}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-bold text-lg">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {product.images &&
                                    product.images.length > 1 && (
                                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                            {product.images.map(
                                                (image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                image
                                                            )
                                                        }
                                                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                                                            selectedImage ===
                                                            image
                                                                ? "border-indigo-600 ring-2 ring-indigo-100"
                                                                : "border-transparent hover:border-gray-200"
                                                        }`}
                                                    >
                                                        <img
                                                            src={`/storage/${image}`}
                                                            alt={`${
                                                                product.name
                                                            } ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-3xl font-bold text-indigo-600">
                                        ৳{product.sale_price}
                                    </div>
                                    {product.stock > 0 ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            In Stock({product.stock} available)
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                                    <p>{product.description} </p>
                                </div>

                                <div className="mt-auto space-y-6">
                                    {/* Quantity & Actions */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        "decrement"
                                                    )
                                                }
                                                className="p-3 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                                                disabled={quantity <= 1}
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <span className="w-12 text-center font-medium text-gray-900">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        "increment"
                                                    )
                                                }
                                                className="p-3 hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                                                disabled={
                                                    quantity >= product.stock
                                                }
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>

                                        <button
                                            className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={product.stock <= 0}
                                        >
                                            <ShoppingCart size={20} />
                                            Add to Cart
                                        </button>

                                        <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                                            <Heart size={20} />
                                        </button>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="border-t border-gray-100 pt-6 space-y-3 text-sm text-gray-500">
                                        {product.sku && (
                                            <div className="flex justify-between">
                                                <span>SKU:</span>
                                                <span className="font-medium text-gray-900">
                                                    {product.sku}
                                                </span>
                                            </div>
                                        )}
                                        {product.category && (
                                            <div className="flex justify-between">
                                                <span>Category: </span>
                                                <Link
                                                    href={route(
                                                        "products.category",
                                                        product.category.slug
                                                    )}
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    {product.category.title}
                                                </Link>
                                            </div>
                                        )}
                                        {product.supplier && (
                                            <div className="flex justify-between">
                                                <span>Supplier: </span>
                                                <span className="font-medium text-gray-900">
                                                    {product.supplier.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ProductShow;
