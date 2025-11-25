import React from "react";
import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Master from "@/Layouts/Master";
import SelectInput from "@/Components/Ui/SelectInput";
import { useForm } from "@inertiajs/react";
import { CreatePageProps } from "@/types";
import InputError from "@/Components/Ui/InputError";
import { PlusIcon, Trash2Icon } from "lucide-react";
import ImageUploader from "@/Components/Ui/ImageUploader";
import TextArea from "@/Components/Ui/TextArea";

// Interfaces
interface QtyPrice {
    id: string; // Used for UI keys and unique IDs
    qty: string;
    qty_price: string;
}

interface Variation {
    id: string; // Used for UI keys and unique IDs
    attribute_id: string;
    value: string;
    stock?: string;
    price?: string;
}

export default function Create({
    categories,
    suppliers,
    attributes,
}: CreatePageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        category_id: "",
        supplier_id: "",
        description: "",
        purchase_price: "",
        sale_price: "",
        moq_price: "",
        stock: "",
        uan_price: "",
        qty_prices: [] as QtyPrice[],
        images: [] as File[],
        variations: [] as Variation[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.product.store"), {
            forceFormData: true,
        });
    };

    const addQtyPrice = () => {
        const newQtyPrice: QtyPrice = {
            id: Date.now().toString(),
            qty: "",
            qty_price: "",
        };
        setData("qty_prices", [...data.qty_prices, newQtyPrice]);
    };

    const removeQtyPrice = (id: string) => {
        setData(
            "qty_prices",
            data.qty_prices.filter((item) => item.id !== id)
        );
    };

    const updateQtyPrice = (
        id: string,
        field: keyof QtyPrice,
        value: string
    ) => {
        const updated = data.qty_prices.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setData("qty_prices", updated);
    };

    const addVariation = () => {
        const newVariation: Variation = {
            id: Date.now().toString() + Math.random(),
            attribute_id: "",
            value: "",
            stock: "",
            price: "",
        };
        setData("variations", [...data.variations, newVariation]);
    };

    const removeVariation = (id: string) => {
        setData(
            "variations",
            data.variations.filter((item) => item.id !== id)
        );
    };

    const updateVariation = (
        id: string,
        field: keyof Variation,
        value: string
    ) => {
        const updated = data.variations.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setData("variations", updated);
    };

    const handleImagesChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("images", files);
        } else if (files) {
            setData("images", [files]);
        } else {
            setData("images", []);
        }
    };

    return (
        <Master
            title="Create Product"
            head={<Header title="Create Product" showUserMenu={true} />}
        >
            <form onSubmit={handleSubmit}>
                <div className="lg:p-6 sm:p-2">
                    <CollapsibleSection
                        title="General Information"
                        defaultOpen={true}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details </CardTitle>
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
                                        onChange={(e) => {
                                            setData("name", e.target.value);
                                            const slug = e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]+/g, "-")
                                                .replace(/(^-|-$)/g, "");
                                            setData((data) => ({
                                                ...data,
                                                name: e.target.value,
                                                slug: slug,
                                            }));
                                        }}
                                        placeholder="Enter product name"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="slug"
                                        value="Slug"
                                        required
                                    />
                                    <TextInput
                                        id="slug"
                                        name="slug"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                        placeholder="product-slug"
                                        required
                                    />
                                    <InputError message={errors.slug} />
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
                                                value: c.id,
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
                                                value: s.id,
                                                label: s.name,
                                            }))}
                                            placeholder="Select Supplier"
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

                <div className="lg:p-6 sm:p-2">
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Product Pricing & Stock </CardTitle>
                        </CardHeader>
                        <CardContent padding="lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <InputLabel
                                        htmlFor="purchase_price"
                                        value="Buy Price"
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
                                        placeholder="0.00"
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
                                        placeholder="0.00"
                                        required
                                    />
                                    <InputError message={errors.sale_price} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="moq_price"
                                        value="MOQ Price"
                                        required
                                    />
                                    <TextInput
                                        id="moq_price"
                                        name="moq_price"
                                        type="number"
                                        value={data.moq_price}
                                        onChange={(e) =>
                                            setData("moq_price", e.target.value)
                                        }
                                        placeholder="0.00"
                                        required
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
                                        placeholder="0"
                                        required
                                    />
                                    <InputError message={errors.stock} />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="uan_price"
                                        value="UAN(¥)"
                                        required
                                    />
                                    <TextInput
                                        id="uan_price"
                                        name="uan_price"
                                        type="number"
                                        value={data.uan_price}
                                        onChange={(e) =>
                                            setData("uan_price", e.target.value)
                                        }
                                        placeholder="0.00"
                                        required
                                    />
                                    <InputError message={errors.uan_price} />
                                </div>
                            </div>

                            {/* Qty Price Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <InputLabel value="Qty Price" />
                                    <PrimaryButton
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
                                    <Card
                                        key={qtyPrice.id}
                                        className="mb-4 relative"
                                    >
                                        <CardContent className="pt-6">
                                            <div className="absolute top-3 right-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeQtyPrice(
                                                            qtyPrice.id
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel
                                                        htmlFor={`qty-${qtyPrice.id}`}
                                                        value="Quantity"
                                                        required
                                                    />
                                                    <TextInput
                                                        id={`qty-${qtyPrice.id}`}
                                                        name={`qty_prices[${index}][qty]`}
                                                        type="number"
                                                        value={qtyPrice.qty}
                                                        onChange={(e) =>
                                                            updateQtyPrice(
                                                                qtyPrice.id,
                                                                "qty",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="0"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <InputLabel
                                                        htmlFor={`qty_price-${qtyPrice.id}`}
                                                        value="Qty Price"
                                                        required
                                                    />
                                                    <TextInput
                                                        id={`qty_price-${qtyPrice.id}`}
                                                        name={`qty_prices[${index}][qty_price]`}
                                                        type="number"
                                                        value={
                                                            qtyPrice.qty_price
                                                        }
                                                        onChange={(e) =>
                                                            updateQtyPrice(
                                                                qtyPrice.id,
                                                                "qty_price",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="0.00"
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

                <div className="lg:p-6 sm:p-2">
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Product Images & Variations </CardTitle>
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
                                        htmlFor="product_variation"
                                        value="Product Variations"
                                        className="text-lg font-semibold"
                                    />
                                    <PrimaryButton
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
                                        <Card
                                            key={variation.id}
                                            className="relative"
                                        >
                                            <CardContent className="pt-6">
                                                <div className="absolute top-3 right-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeVariation(
                                                                variation.id
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2Icon size={18} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-attribute-${variation.id}`}
                                                            value="Attribute"
                                                            required
                                                        />
                                                        <SelectInput
                                                            id={`variation-attribute-${variation.id}`}
                                                            name={`variations[${index}][attribute_id]`}
                                                            value={
                                                                variation.attribute_id
                                                            }
                                                            onChange={(val) =>
                                                                updateVariation(
                                                                    variation.id,
                                                                    "attribute_id",
                                                                    val
                                                                )
                                                            }
                                                            options={attributes.map(
                                                                (attr) => ({
                                                                    value: attr.id,
                                                                    label: attr.name,
                                                                })
                                                            )}
                                                            placeholder="Select Attribute"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-value-${variation.id}`}
                                                            value="Value"
                                                            required
                                                        />
                                                        <TextInput
                                                            id={`variation-value-${variation.id}`}
                                                            name={`variations[${index}][value]`}
                                                            value={
                                                                variation.value
                                                            }
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    variation.id,
                                                                    "value",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="e.g., Red, Large"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-stock-${variation.id}`}
                                                            value="Variation Stock"
                                                        />
                                                        <TextInput
                                                            id={`variation-stock-${variation.id}`}
                                                            name={`variations[${index}][stock]`}
                                                            type="number"
                                                            value={
                                                                variation.stock ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    variation.id,
                                                                    "stock",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            htmlFor={`variation-price-${variation.id}`}
                                                            value="Variation Price"
                                                        />
                                                        <TextInput
                                                            id={`variation-price-${variation.id}`}
                                                            name={`variations[${index}][price]`}
                                                            type="number"
                                                            value={
                                                                variation.price ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                updateVariation(
                                                                    variation.id,
                                                                    "price",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Optional"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs text-gray-500">
                                                    <p>
                                                        Variation stock and
                                                        price will override the
                                                        main product stock and
                                                        price for this specific
                                                        variation.Leave empty to
                                                        use main product values.
                                                    </p>
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

                <div className="lg:p-6 p-4 pt-6 pb-6">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto justify-center"
                        >
                            {processing ? "Creating..." : "Create Product"}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Master>
    );
}
