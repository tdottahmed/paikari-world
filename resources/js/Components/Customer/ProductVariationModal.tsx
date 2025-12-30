import React, { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Product, ProductVariation } from "@/types";
import { X, Check } from "lucide-react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";

interface ProductVariationModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    onAddToCart: (variations: ProductVariation[], quantity: number) => void;
}

const ProductVariationModal: React.FC<ProductVariationModalProps> = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
}) => {
    const [selectedVariations, setSelectedVariations] = useState<
        Record<number, ProductVariation>
    >({});
    const [quantity, setQuantity] = useState(1);

    // Group variations by attribute
    const variationsByAttribute = React.useMemo(() => {
        const groups: Record<
            number,
            { name: string; variations: ProductVariation[] }
        > = {};

        if (!product.product_variations) return groups;

        product.product_variations.forEach((variation) => {
            // Group by product_attribute_id
            const attrId = variation.product_attribute_id;
            const attrName =
                variation.product_attribute?.name || variation.name || "Option";

            if (attrId) {
                if (!groups[attrId]) {
                    groups[attrId] = {
                        name: attrName,
                        variations: [],
                    };
                }
                groups[attrId].variations.push(variation);
            }
        });

        return groups;
    }, [product]);

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedVariations({});
            setQuantity(1);
        }
    }, [isOpen]);

    const handleVariationSelect = (
        attributeId: number,
        variation: ProductVariation
    ) => {
        setSelectedVariations((prev) => ({
            ...prev,
            [attributeId]: variation,
        }));
    };

    const isAllSelected =
        Object.keys(variationsByAttribute).length > 0 &&
        Object.keys(variationsByAttribute).every(
            (attrId) => selectedVariations[Number(attrId)]
        );

    // Calculate available stock from selected variations
    const availableStock = useMemo(() => {
        if (!isAllSelected || Object.keys(selectedVariations).length === 0) {
            return product.stock;
        }

        const selectedVariationList = Object.values(selectedVariations);
        const variationStocks = selectedVariationList
            .map((v) => v.stock ?? product.stock)
            .filter((s) => s !== undefined && s !== null && !isNaN(s));

        if (variationStocks.length === 0) {
            return product.stock;
        }

        // Return minimum stock from all selected variations
        return Math.min(...variationStocks);
    }, [selectedVariations, isAllSelected, product.stock]);

    const handleQuantityChange = (newQuantity: number) => {
        const maxQty = product.is_preorder ? undefined : availableStock;
        if (maxQty !== undefined && newQuantity > maxQty) {
            setQuantity(maxQty);
        } else if (newQuantity < 1) {
            setQuantity(1);
        } else {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        if (!isAllSelected) return;
        onAddToCart(Object.values(selectedVariations), quantity);
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Select Options
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <div className="flex gap-4 mb-4">
                                        {/* Product Thumbnail if available */}
                                        {product.images?.[0] && (
                                            <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={getAssetUrl(product.images[0])}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-medium text-gray-900 line-clamp-2">
                                                {product.name}
                                            </h4>
                                            <p className="text-indigo-600 font-bold mt-1">
                                                {formatPrice(
                                                    product.sale_price
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="space-y-4">
                                        {Object.entries(
                                            variationsByAttribute
                                        ).map(([attrId, group]) => (
                                            <div key={attrId}>
                                                <h5 className="text-sm font-medium text-gray-700 mb-2">
                                                    {group.name}
                                                </h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {group.variations.map(
                                                        (variation) => {
                                                            const isSelected =
                                                                selectedVariations[
                                                                    Number(
                                                                        attrId
                                                                    )
                                                                ]?.id ===
                                                                variation.id;
                                                            return (
                                                                <button
                                                                    key={
                                                                        variation.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleVariationSelect(
                                                                            Number(
                                                                                attrId
                                                                            ),
                                                                            variation
                                                                        )
                                                                    }
                                                                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                                                                        isSelected
                                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                                                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                                    }`}
                                                                >
                                                                    {
                                                                        variation.value
                                                                    }
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Stock Info */}
                                    {isAllSelected && (
                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Available Stock:
                                                </span>
                                                <span
                                                    className={`font-semibold ${
                                                        availableStock > 0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {availableStock}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quantity */}
                                    <div className="mt-6 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700">
                                            {" "}
                                            Quantity{" "}
                                        </span>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    quantity <= 1 ||
                                                    (!product.is_preorder &&
                                                        availableStock === 0)
                                                }
                                                className="px-3 py-1 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                -
                                            </button>
                                            <span className="px-3 py-1 font-medium min-w-[2rem] text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    !product.is_preorder &&
                                                    quantity >= availableStock
                                                }
                                                className="px-3 py-1 hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className={`w-full inline-flex justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                                            isAllSelected &&
                                            (product.is_preorder ||
                                                availableStock > 0)
                                                ? "bg-indigo-600 hover:bg-indigo-700"
                                                : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                        onClick={handleAddToCart}
                                        disabled={
                                            !isAllSelected ||
                                            (!product.is_preorder &&
                                                availableStock === 0)
                                        }
                                    >
                                        {!product.is_preorder &&
                                        availableStock === 0
                                            ? "Out of Stock"
                                            : "Add to Cart"}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ProductVariationModal;
