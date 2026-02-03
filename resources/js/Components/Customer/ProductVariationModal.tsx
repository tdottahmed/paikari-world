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
    const [cartBatch, setCartBatch] = useState<
        { variations: ProductVariation[]; quantity: number }[]
    >([]);

    // Group variations by attribute
    const variationsByAttribute = React.useMemo(() => {
        const groups: Record<
            number,
            { name: string; variations: ProductVariation[] }
        > = {};

        if (!product.product_variations) return groups;

        product.product_variations.forEach((variation) => {
            const attrId = variation.product_attribute_id;
            const attrName =
                variation.product_attribute?.name ||
                variation.attribute?.name ||
                "Option";

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
            setCartBatch([]);
        }
    }, [isOpen]);

    const handleVariationSelect = (
        attributeId: number,
        variation: ProductVariation,
    ) => {
        setSelectedVariations((prev) => ({
            ...prev,
            [attributeId]: variation,
        }));
    };

    const isAllSelected =
        Object.keys(variationsByAttribute).length > 0 &&
        Object.keys(variationsByAttribute).every(
            (attrId) => selectedVariations[Number(attrId)],
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

        return Math.min(...variationStocks);
    }, [selectedVariations, isAllSelected, product.stock]);

    // Calculate current price based on selection
    const currentPrice = useMemo(() => {
        if (!isAllSelected || Object.keys(selectedVariations).length === 0) {
            // Check if product has variations with prices to show range (handled in card)
            // Here just show base price or min? Base price.
            return product.sale_price;
        }

        // Logic: specific variation price overrides base price.
        // If multiple selected, max of them? or sum?
        // Assuming override for simply variant logic.
        const prices = Object.values(selectedVariations)
            .map((v) => (v.price ? parseFloat(String(v.price)) : null))
            .filter((p) => p !== null) as number[];

        if (prices.length > 0) {
            return Math.max(...prices); // Take the highest price if multiple apply? Or maybe just the one relevant.
        }

        return product.sale_price;
    }, [selectedVariations, isAllSelected, product.sale_price]);

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

    const handleAddToBatch = () => {
        if (!isAllSelected) return;

        setCartBatch((prev) => [
            ...prev,
            {
                variations: Object.values(selectedVariations),
                quantity: quantity,
            },
        ]);

        // Reset selection for next item? Maybe keep it for easy duplicate add?
        // Let's keep selection but reset quantity?
        setQuantity(1);
        // Optional: clear selection
        // setSelectedVariations({});
    };

    const handleRemoveFromBatch = (index: number) => {
        setCartBatch((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddToCart = () => {
        if (cartBatch.length > 0) {
            // Upload multiple items
            // App only supports one call?
            // We need to iterate in parent or support array.
            // Current parent supports: (variations: ProductVariation[], quantity: number)
            // We will loop here and call onAddToCart multiple times? No, that might race.

            // Wait, ProductCard implementation uses addToCart store action.
            // Store action adds one item.
            // Better to modify ProductCard interaction?
            // Or just iterate here.

            cartBatch.forEach((item) => {
                onAddToCart(item.variations, item.quantity);
            });
            onClose();
        } else {
            if (!isAllSelected) return;
            onAddToCart(Object.values(selectedVariations), quantity);
            onClose();
        }
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

                                <div className="mt-2 text-sm">
                                    <div className="flex gap-4 mb-4">
                                        {/* Product Thumbnail if available */}
                                        {product.images?.[0] && (
                                            <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={getAssetUrl(
                                                        product.images[0],
                                                    )}
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
                                                {formatPrice(currentPrice)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Attributes */}
                                    <div className="space-y-4 max-h-[40vh] overflow-y-auto p-1">
                                        {Object.entries(
                                            variationsByAttribute,
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
                                                                        attrId,
                                                                    )
                                                                ]?.id ===
                                                                variation.id;
                                                            // Show price hint in pill if it differs?
                                                            const showPriceHint =
                                                                variation.price &&
                                                                parseFloat(
                                                                    String(
                                                                        variation.price,
                                                                    ),
                                                                ) !==
                                                                    product.sale_price;

                                                            return (
                                                                <button
                                                                    key={
                                                                        variation.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleVariationSelect(
                                                                            Number(
                                                                                attrId,
                                                                            ),
                                                                            variation,
                                                                        )
                                                                    }
                                                                    className={`px-3 py-1.5 rounded-full text-sm border transition-all flex items-center gap-1 ${
                                                                        isSelected
                                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600"
                                                                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                                                                    }`}
                                                                >
                                                                    {
                                                                        variation.value
                                                                    }
                                                                    {showPriceHint && (
                                                                        <span className="text-xs opacity-75">
                                                                            {" "}
                                                                            (
                                                                            {formatPrice(
                                                                                variation.price!,
                                                                            )}
                                                                            )
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Quantity and Add to Batch */}
                                    <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-medium text-gray-700">
                                                {" "}
                                                Quantity{" "}
                                            </span>
                                            <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            quantity - 1,
                                                        )
                                                    }
                                                    disabled={
                                                        quantity <= 1 ||
                                                        (!product.is_preorder &&
                                                            availableStock ===
                                                                0)
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-200"
                                                >
                                                    -
                                                </button>
                                                <span className="w-10 text-center font-medium text-gray-900">
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            quantity + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        !product.is_preorder &&
                                                        quantity >=
                                                            availableStock
                                                    }
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className={`w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none transition-all ${
                                                isAllSelected &&
                                                (product.is_preorder ||
                                                    availableStock > 0)
                                                    ? "bg-gray-900 hover:bg-gray-800"
                                                    : "bg-gray-300 cursor-not-allowed"
                                            }`}
                                            onClick={handleAddToBatch}
                                            disabled={
                                                !isAllSelected ||
                                                (!product.is_preorder &&
                                                    availableStock === 0)
                                            }
                                        >
                                            Add to Selection
                                        </button>
                                    </div>

                                    {/* Batch List */}
                                    {cartBatch.length > 0 && (
                                        <div className="mt-4 border-t pt-4">
                                            <h5 className="font-medium text-gray-700 mb-2">
                                                {" "}
                                                Selected Items:{" "}
                                            </h5>
                                            <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                                {cartBatch.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs"
                                                        >
                                                            <div>
                                                                <div className="font-medium">
                                                                    {item.variations
                                                                        .map(
                                                                            (
                                                                                v,
                                                                            ) =>
                                                                                v.value,
                                                                        )
                                                                        .join(
                                                                            ", ",
                                                                        )}
                                                                </div>
                                                                <div className="text-gray-500">
                                                                    {" "}
                                                                    Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }{" "}
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveFromBatch(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 p-1"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-600">
                                            {" "}
                                            Total Items:{" "}
                                        </span>
                                        <span className="font-bold text-lg">
                                            {cartBatch.reduce(
                                                (acc, item) =>
                                                    acc + item.quantity,
                                                0,
                                            ) +
                                                (cartBatch.length === 0 &&
                                                isAllSelected
                                                    ? quantity
                                                    : 0)}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`w-full inline-flex justify-center rounded-lg border border-transparent px-4 py-3 text-sm font-bold text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                                            cartBatch.length > 0 ||
                                            (isAllSelected &&
                                                (product.is_preorder ||
                                                    availableStock > 0))
                                                ? "bg-indigo-600 hover:bg-indigo-700"
                                                : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                        onClick={handleAddToCart}
                                        disabled={
                                            !(
                                                cartBatch.length > 0 ||
                                                (isAllSelected &&
                                                    (product.is_preorder ||
                                                        availableStock > 0))
                                            )
                                        }
                                    >
                                        Add {cartBatch.length > 0 ? "All" : ""}{" "}
                                        to Cart
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
