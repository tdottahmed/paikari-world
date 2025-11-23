import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { PlusIcon, Trash2Icon, ArrowLeftIcon } from "lucide-react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import SelectInput from "@/Components/Ui/SelectInput";
import TextArea from "@/Components/Ui/TextArea";
import InputError from "@/Components/Ui/InputError";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import DangerButton from "@/Components/Actions/DangerButton";
import DeleteConfirmationDialog from "@/Components/Ui/DeleteConfirmationDialog";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { EditPageProps } from "@/types";

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
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [processingDelete, setProcessingDelete] = useState(false);

    const [existingImages, setExistingImages] = useState<string[]>(
        product.images || []
    );

    const {
        data,
        setData,
        post,
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

        qty_prices: (product.qty_prices || []).map((qp: any) => ({
            qty: qp.qty.toString(),
            qty_price: qp.price.toString(),
        })) as QtyPrice[],

        variations: (product.variations || []).map((v: any) => ({
            attribute_id: v.attribute_id.toString(),
            value: v.value,
            stock: v.stock?.toString(),
            price: v.price?.toString(),
        })) as Variation[],

        images: [] as File[],
        deleted_images: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.product.update", product.id), {
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

    const addQtyPrice = () =>
        setData("qty_prices", [...data.qty_prices, { qty: "", qty_price: "" }]);
    const removeQtyPrice = (index: number) =>
        setData(
            "qty_prices",
            data.qty_prices.filter((_, i) => i !== index)
        );
    const updateQtyPrice = (
        index: number,
        field: keyof QtyPrice,
        value: string
    ) => {
        const updated = data.qty_prices.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData("qty_prices", updated);
    };

    const addVariation = () =>
        setData("variations", [
            ...data.variations,
            { attribute_id: "", value: "", stock: "", price: "" },
        ]);
    const removeVariation = (index: number) =>
        setData(
            "variations",
            data.variations.filter((_, i) => i !== index)
        );
    const updateVariation = (
        index: number,
        field: keyof Variation,
        value: string
    ) => {
        const updated = data.variations.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData("variations", updated);
    };

    const handleNewImagesChange = (files: File[]) => {
        setData("images", files);
    };

    const handleRemoveExistingImage = (path: string) => {
        setData("deleted_images", [...data.deleted_images, path]);
        setExistingImages((prev) => prev.filter((img) => img !== path));
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
                                            value={data.category_id}
                                            onChange={(val) =>
                                                setData("category_id", val)
                                            }
                                            options={categories.map((c) => ({
                                                value: c.id.toString(),
                                                label: c.title,
                                            }))}
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
                                            value={data.supplier_id}
                                            onChange={(val) =>
                                                setData("supplier_id", val)
                                            }
                                            options={suppliers.map((s) => ({
                                                value: s.id.toString(),
                                                label: s.name,
                                            }))}
                                            error={errors.supplier_id}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1">
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
                                    <InputError message={errors.description} />
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
                                    <InputLabel value="Quantity Prices" />
                                    <PrimaryButton
                                        as="button"
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addQtyPrice}
                                    >
                                        <PlusIcon size={16} className="mr-1" />{" "}
                                        Add Qty Price
                                    </PrimaryButton>
                                </div>
                                {data.qty_prices.map((qtyPrice, index) => (
                                    <Card key={index} className="mb-4 relative">
                                        <CardContent className="pt-6">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeQtyPrice(index)
                                                }
                                                className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2Icon size={18} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel
                                                        value="Quantity"
                                                        required
                                                    />
                                                    <TextInput
                                                        id="qty"
                                                        name="qty"
                                                        type="number"
                                                        value={qtyPrice.qty}
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
                                                        value="Price"
                                                        required
                                                    />
                                                    <TextInput
                                                        id="qty_price"
                                                        name="qty_price"
                                                        type="number"
                                                        value={
                                                            qtyPrice.qty_price
                                                        }
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
                                    onChange={handleNewImagesChange}
                                    existingImages={existingImages}
                                    onRemoveExisting={handleRemoveExistingImage}
                                    error={errors.images}
                                />
                            </div>

                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <InputLabel
                                        value="Product Variations"
                                        className="text-lg font-semibold"
                                    />
                                    <PrimaryButton
                                        as="button"
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addVariation}
                                    >
                                        <PlusIcon size={16} className="mr-1" />{" "}
                                        Add Variation
                                    </PrimaryButton>
                                </div>

                                <div className="space-y-4">
                                    {data.variations.map((variation, index) => (
                                        <Card key={index} className="relative">
                                            <CardContent className="pt-6">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeVariation(index)
                                                    }
                                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2Icon size={18} />
                                                </button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <InputLabel
                                                            value="Attribute"
                                                            required
                                                        />
                                                        <SelectInput
                                                            id="variation_attribute"
                                                            name="variation_attribute"
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
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.variations
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            value="Value"
                                                            required
                                                        />
                                                        <TextInput
                                                            name="variation_value"
                                                            id="variation_value"
                                                            value={
                                                                variation.value
                                                            }
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    index,
                                                                    "value",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel value="Stock (Optional)" />
                                                        <TextInput
                                                            name="variation_stock"
                                                            id="variation_stock"
                                                            type="number"
                                                            value={
                                                                variation.stock ||
                                                                ""
                                                            }
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
                                                        <InputLabel value="Price (Optional)" />
                                                        <TextInput
                                                            id="variation_price"
                                                            name="variation_price"
                                                            type="number"
                                                            value={
                                                                variation.price ||
                                                                ""
                                                            }
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
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {data.variations.length === 0 && (
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

                <div className="p-4 pt-6 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-3 lg:flex-row lg:justify-end">
                            <PrimaryButton
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
                                <ArrowLeftIcon size={16} className="mr-2" />{" "}
                                Back to Products
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </form>

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
