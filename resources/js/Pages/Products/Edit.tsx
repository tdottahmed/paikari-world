import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import DangerButton from "@/Components/Actions/DangerButton";
import Master from "@/Layouts/Master";
import SelectInput from "@/Components/Ui/SelectInput";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/Ui/InputError";
import { PlusIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import ImageUploader from "@/Components/Ui/ImageUploader";
import TextArea from "@/Components/Ui/TextArea";
import DeleteConfirmationDialog from "@/Components/Ui/DeleteConfirmationDialog";
import { EditPageProps, ProductFormData } from "@/types";

interface QtyPrice {
    qty: string;
    qty_price: string;
}

interface Variation {
    attribute_id: string;
    value: string;
    stock?: string;
    price?: string;
}

export default function Edit({
    product,
    categories,
    suppliers,
    attributes,
}: EditPageProps) {
    const [qtyPrices, setQtyPrices] = useState<QtyPrice[]>(
        product.qty_prices?.map((qp) => ({
            qty: qp.qty.toString(),
            qty_price: qp.price.toString(),
        })) || []
    );

    const [variations, setVariations] = useState<Variation[]>(
        product.variations?.map((v) => ({
            attribute_id: v.attribute_id.toString(),
            value: v.value,
            stock: v.stock?.toString(),
            price: v.price?.toString(),
        })) || []
    );

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [processingDelete, setProcessingDelete] = useState(false);

    const {
        data,
        setData,
        put,
        processing,
        errors,
        delete: destroy,
    } = useForm({
        name: product.name || "",
        category_id: product.category_id?.toString() || "",
        supplier_id: product.supplier_id?.toString() || "",
        description: product.description || "",
        purchase_price: product.purchase_price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
        moq_price: product.moq_price?.toString() || "",
        stock: product.stock?.toString() || "",
        uan_price: product.uan_price?.toString() || "",
        qty_prices: [] as QtyPrice[],
        images: [] as File[],
        variations: [] as Variation[],
        _method: "put" as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.product.update", product.id), {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        setProcessingDelete(true);
        destroy(route("admin.product.destroy", product.id), {
            onFinish: () => {
                setProcessingDelete(false);
                setShowDeleteDialog(false);
            },
        });
    };

    const addQtyPrice = () => {
        const newQtyPrice: QtyPrice = {
            qty: "",
            qty_price: "",
        };
        const updatedQtyPrices = [...qtyPrices, newQtyPrice];
        setQtyPrices(updatedQtyPrices);
        setData("qty_prices", updatedQtyPrices);
    };

    const removeQtyPrice = (index: number) => {
        const updatedQtyPrices = qtyPrices.filter((_, i) => i !== index);
        setQtyPrices(updatedQtyPrices);
        setData("qty_prices", updatedQtyPrices);
    };

    const updateQtyPrice = (
        index: number,
        field: keyof QtyPrice,
        value: string
    ) => {
        const updatedQtyPrices = qtyPrices.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setQtyPrices(updatedQtyPrices);
        setData("qty_prices", updatedQtyPrices);
    };

    const addVariation = () => {
        const newVariation: Variation = {
            attribute_id: "",
            value: "",
            stock: "",
            price: "",
        };
        const updatedVariations = [...variations, newVariation];
        setVariations(updatedVariations);
        setData("variations", updatedVariations);
    };

    const removeVariation = (index: number) => {
        const updatedVariations = variations.filter((_, i) => i !== index);
        setVariations(updatedVariations);
        setData("variations", updatedVariations);
    };

    const updateVariation = (
        index: number,
        field: keyof Variation,
        value: string
    ) => {
        const updatedVariations = variations.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setVariations(updatedVariations);
        setData("variations", updatedVariations);
    };

    const handleImagesChange = (files: File[]) => {
        setData("images", files);
    };

    const getAttributeName = (attributeId: string) => {
        return (
            attributes.find((attr) => attr.id.toString() === attributeId)
                ?.name || attributeId
        );
    };

    return (
        <Master
            title={`Edit ${product.name}`}
            head={<Header title={`Edit ${product.name}`} showUserMenu={true} />}
        >
            <form onSubmit={handleSubmit}>
                <div className="lg:p-6 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Edit Product
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Update product information and pricing
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <DangerButton
                                type="button"
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={processing || processingDelete}
                                className="w-full sm:w-auto order-2 sm:order-1"
                            >
                                <Trash2Icon size={16} className="mr-2" />
                                Delete Product
                            </DangerButton>
                        </div>
                    </div>
                </div>

                <div className="lg:p-6 sm:p-2">
                    <CollapsibleSection
                        title="General Information"
                        defaultOpen={true}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                            </CardHeader>
                            <CardContent padding="lg">
                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Product Name"
                                        required
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        placeholder="Enter product name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="category_id"
                                            value="Category"
                                            required
                                        />
                                        <SelectInput
                                            id="category_id"
                                            name="category_id"
                                            value={data.category_id}
                                            onChange={(val) =>
                                                setData("category_id", val)
                                            }
                                            options={categories.map((c) => ({
                                                value: c.id.toString(),
                                                label: c.title,
                                            }))}
                                            placeholder="Select Category"
                                            error={errors.category_id}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="supplier_id"
                                            value="Supplier"
                                            required
                                        />
                                        <SelectInput
                                            id="supplier_id"
                                            name="supplier_id"
                                            value={data.supplier_id}
                                            onChange={(val) =>
                                                setData("supplier_id", val)
                                            }
                                            options={suppliers.map((s) => ({
                                                value: s.id.toString(),
                                                label: s.name,
                                            }))}
                                            placeholder="Select Supplier"
                                            error={errors.supplier_id}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1">
                                    <div className="description">
                                        <InputLabel
                                            htmlFor="description"
                                            value="Description"
                                            required
                                        />
                                        <TextArea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleSection>
                </div>

                {/* Pricing & Stock Section */}
                <div className="lg:p-6 sm:p-2">
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Product Pricing & Stock</CardTitle>
                        </CardHeader>
                        <CardContent padding="lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <InputLabel
                                        htmlFor="purchase_price"
                                        value="Purchase Price"
                                        required
                                    />
                                    <TextInput
                                        id="purchase_price"
                                        name="purchase_price"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.purchase_price}
                                        onChange={(e) =>
                                            setData(
                                                "purchase_price",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.purchase_price}
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="sale_price"
                                        value="Sale Price"
                                        required
                                    />
                                    <TextInput
                                        id="sale_price"
                                        name="sale_price"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.sale_price}
                                        onChange={(e) =>
                                            setData(
                                                "sale_price",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <InputError message={errors.sale_price} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="moq_price"
                                        value="MOQ Price"
                                    />
                                    <TextInput
                                        id="moq_price"
                                        name="moq_price"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.moq_price}
                                        onChange={(e) =>
                                            setData("moq_price", e.target.value)
                                        }
                                    />
                                    <InputError message={errors.moq_price} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel
                                        htmlFor="stock"
                                        value="Stock"
                                        required
                                    />
                                    <TextInput
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        placeholder="0"
                                        value={data.stock}
                                        onChange={(e) =>
                                            setData("stock", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.stock} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="uan_price"
                                        value="UAN Price"
                                    />
                                    <TextInput
                                        id="uan_price"
                                        name="uan_price"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.uan_price}
                                        onChange={(e) =>
                                            setData("uan_price", e.target.value)
                                        }
                                    />
                                    <InputError message={errors.uan_price} />
                                </div>
                            </div>

                            {/* Qty Price Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <InputLabel
                                        htmlFor="qty_price"
                                        value="Quantity Prices"
                                    />
                                    <PrimaryButton
                                        as="button"
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addQtyPrice}
                                    >
                                        <PlusIcon size={16} className="mr-1" />
                                        Add Qty Price
                                    </PrimaryButton>
                                </div>

                                {qtyPrices.map((qtyPrice, index) => (
                                    <Card key={index} className="mb-4 relative">
                                        <CardContent className="pt-6">
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeQtyPrice(index)
                                                    }
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel
                                                        htmlFor={`qty-${index}`}
                                                        value="Quantity"
                                                        required
                                                    />
                                                    <TextInput
                                                        id={`qty-${index}`}
                                                        name={`qty-${index}`}
                                                        type="number"
                                                        value={qtyPrice.qty}
                                                        placeholder="0"
                                                        onChange={(e) =>
                                                            updateQtyPrice(
                                                                index,
                                                                "qty",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel
                                                        htmlFor={`qty_price-${index}`}
                                                        value="Price"
                                                        required
                                                    />
                                                    <TextInput
                                                        id={`qty_price-${index}`}
                                                        name={`qty_price-${index}`}
                                                        type="number"
                                                        value={
                                                            qtyPrice.qty_price
                                                        }
                                                        placeholder="0.00"
                                                        onChange={(e) =>
                                                            updateQtyPrice(
                                                                index,
                                                                "qty_price",
                                                                e.target.value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Images & Variations Section */}
                <div className="lg:p-6 sm:p-2">
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Product Images & Variations</CardTitle>
                        </CardHeader>
                        <CardContent padding="lg">
                            <div className="mb-8">
                                <ImageUploader
                                    label="Product Images"
                                    value={data.images}
                                    onChange={handleImagesChange}
                                    error={errors.images}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <InputLabel
                                        value="Product Variations"
                                        htmlFor="product_variation"
                                        className="text-lg font-semibold"
                                    />
                                    <PrimaryButton
                                        as="button"
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addVariation}
                                    >
                                        <PlusIcon size={16} className="mr-1" />
                                        Add Variation
                                    </PrimaryButton>
                                </div>

                                <div className="space-y-4">
                                    {variations.map((variation, index) => (
                                        <Card key={index} className="relative">
                                            <CardContent className="pt-6">
                                                <div className="absolute top-3 right-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVariation(
                                                                index
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                        title="Remove variation"
                                                    >
                                                        <Trash2Icon size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-attribute-${index}`}
                                                            value="Attribute"
                                                            required
                                                        />
                                                        <SelectInput
                                                            id={`variation-attribute-${index}`}
                                                            name={`variation-attribute-${index}`}
                                                            value={
                                                                variation.attribute_id
                                                            }
                                                            onChange={(val) =>
                                                                updateVariation(
                                                                    index,
                                                                    "attribute_id",
                                                                    val
                                                                )
                                                            }
                                                            options={attributes.map(
                                                                (attr) => ({
                                                                    value: attr.id.toString(),
                                                                    label: attr.name,
                                                                })
                                                            )}
                                                            placeholder="Select Attribute"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-value-${index}`}
                                                            value="Value"
                                                            required
                                                        />
                                                        <TextInput
                                                            id={`variation-value-${index}`}
                                                            name={`variation-value-${index}`}
                                                            type="text"
                                                            value={
                                                                variation.value
                                                            }
                                                            placeholder="Enter value (e.g., Red, Large)"
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    index,
                                                                    "value",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-stock-${index}`}
                                                            value="Variation Stock"
                                                        />
                                                        <TextInput
                                                            id={`variation-stock-${index}`}
                                                            name={`variation-stock-${index}`}
                                                            type="number"
                                                            value={
                                                                variation.stock ||
                                                                ""
                                                            }
                                                            placeholder="Optional"
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    index,
                                                                    "stock",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-price-${index}`}
                                                            value="Variation Price"
                                                        />
                                                        <TextInput
                                                            id={`variation-price-${index}`}
                                                            name={`variation-price-${index}`}
                                                            type="number"
                                                            value={
                                                                variation.price ||
                                                                ""
                                                            }
                                                            placeholder="Optional"
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    index,
                                                                    "price",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-3 text-xs text-gray-500">
                                                    <p>
                                                        Variation stock and
                                                        price will override the
                                                        main product stock and
                                                        price for this specific
                                                        variation. Leave empty
                                                        to use main product
                                                        values.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {variations.length === 0 && (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                            <p className="text-gray-500 mb-2">
                                                No variations added yet
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Add variations like size, color,
                                                material, etc.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 pt-6 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-3 lg:flex-row lg:justify-end">
                            <PrimaryButton
                                as="button"
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto lg:w-auto justify-center"
                            >
                                {processing ? "Updating..." : "Update Product"}
                            </PrimaryButton>

                            <PrimaryButton
                                as="link"
                                href={route("admin.products.index")}
                                variant="outline"
                                className="w-full sm:w-auto lg:w-auto justify-center"
                            >
                                <ArrowLeftIcon size={16} className="mr-2" />
                                Back to Products
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                confirmText={
                    processingDelete ? "Deleting..." : "Delete Product"
                }
                isProcessing={processingDelete}
            />
        </Master>
    );
}
