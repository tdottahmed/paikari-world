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
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import InputError from "@/Components/Ui/InputError";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import ImageUploader from "@/Components/Ui/ImageUploader";

interface QtyPrice {
    id: string;
    qty: string;
    qty_price: string;
}

export default function Create({ categories, suppliers }: CreatePageProps) {
    const [qtyPrices, setQtyPrices] = useState<QtyPrice[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        category: "",
        supplier: "",
        description: "",
        buy_price: "",
        sale_price: "",
        moq_price: "",
        stock: "",
        uan_price: "",
        qty_prices: [] as QtyPrice[],
        images: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("products.store"));
    };

    const addQtyPrice = () => {
        const newQtyPrice: QtyPrice = {
            id: Date.now().toString(),
            qty: "",
            qty_price: "",
        };
        setQtyPrices([...qtyPrices, newQtyPrice]);
        setData("qty_prices", [...qtyPrices, newQtyPrice]);
    };

    const removeQtyPrice = (id: string) => {
        const updatedQtyPrices = qtyPrices.filter((item) => item.id !== id);
        setQtyPrices(updatedQtyPrices);
        setData("qty_prices", updatedQtyPrices);
    };

    const updateQtyPrice = (
        id: string,
        field: keyof QtyPrice,
        value: string
    ) => {
        const updatedQtyPrices = qtyPrices.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setQtyPrices(updatedQtyPrices);
        setData("qty_prices", updatedQtyPrices);
    };

    const handleImagesChange = (files: File[]) => {
        setData("images", files);
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
                                            htmlFor="category"
                                            value="Category"
                                            required
                                        />

                                        <SelectInput
                                            id="category"
                                            name="category"
                                            value={data.category}
                                            onChange={(val) =>
                                                setData("category", val)
                                            }
                                            options={categories.map((c) => ({
                                                value: c.id,
                                                label: c.title,
                                            }))}
                                            placeholder="Select Category"
                                            error={errors.category}
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="supplier"
                                            value="Supplier"
                                            required
                                        />

                                        <SelectInput
                                            id="supplier"
                                            name="supplier"
                                            value={data.supplier}
                                            onChange={(val) =>
                                                setData("supplier", val)
                                            }
                                            options={suppliers.map((s) => ({
                                                value: s.id,
                                                label: s.name,
                                            }))}
                                            placeholder="Select Supplier"
                                            error={errors.supplier}
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
                                        <RichTextEditor
                                            value={data.description}
                                            onChange={(val) =>
                                                setData("description", val)
                                            }
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
                                        value="Buy Price"
                                        required
                                    />
                                    <TextInput
                                        id="purchase_price"
                                        name="purchase_price"
                                        type="number"
                                        placeholder="0.00"
                                        value={data.buy_price}
                                        onChange={(e) =>
                                            setData("buy_price", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError message={errors.buy_price} />
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
                                        required
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
                                        value="UAN(¥)"
                                        required
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
                                        required
                                    />
                                    <InputError message={errors.uan_price} />
                                </div>
                            </div>

                            {/* Qty Price Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <InputLabel
                                        htmlFor="qty_price"
                                        value="Qty Price"
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

                                {/* Dynamic Qty Price Cards */}
                                {qtyPrices.map((qtyPrice, index) => (
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
                                                    className="text-red-500 hover:text-red-700 transition-colors"
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
                                                        name={`qty-${qtyPrice.id}`}
                                                        type="number"
                                                        value={qtyPrice.qty}
                                                        placeholder="0"
                                                        onChange={(e) =>
                                                            updateQtyPrice(
                                                                qtyPrice.id,
                                                                "qty",
                                                                e.target.value
                                                            )
                                                        }
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
                                                        name={`qty_price-${qtyPrice.id}`}
                                                        type="number"
                                                        value={
                                                            qtyPrice.qty_price
                                                        }
                                                        placeholder="0.00"
                                                        onChange={(e) =>
                                                            updateQtyPrice(
                                                                qtyPrice.id,
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
                <div className="lg:p-6 sm:p-2">
                    <Card className="mt-4">
                        <CardTitle>Product Images & Variations</CardTitle>
                        <CardContent>
                            <ImageUploader
                                label="Images"
                                value={data.images}
                                onChange={(images) => setData("images", images)}
                                error={errors.images}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Submit Button */}
                <div className="lg:p-6 sm:p-2">
                    <div className="flex justify-end">
                        <PrimaryButton
                            as="button"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? "Creating..." : "Create Product"}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Master>
    );
}
