import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Master from "@/Layouts/Master";

import SelectInput from "@/Components/Ui/SelectInput"; // NEW component
import { useForm } from "@inertiajs/react";
import { CreatePageProps } from "@/types";
import RichTextEditor from "@/Components/Ui/RichTextEditor";

export default function Create({ categories, suppliers }: CreatePageProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        price: "",
        supplier: "",
        category: "",
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("products.store"));
    };

    return (
        <Master
            title="Create Product"
            head={<Header title="Create Product" showUserMenu={true} />}
        >
            <div className="lg:p-6 sm:p-2">
                <form onSubmit={handleSubmit}>
                    <CollapsibleSection
                        title="General Information"
                        defaultOpen={true}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Details</CardTitle>
                            </CardHeader>

                            <CardContent padding="lg">
                                {/* NAME */}
                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Product Name"
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
                                </div>

                                {/* PRICE + SUPPLIER */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="category"
                                            value="Category"
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

                                {/* CATEGORY + DESCRIPTION */}
                                <div className="grid grid-cols-1">
                                    <div className="description">
                                        <InputLabel
                                            htmlFor="description"
                                            value="Description"
                                        />
                                        <RichTextEditor
                                            value={data.description}
                                            onChange={(val) =>
                                                setData("description", val)
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CollapsibleSection>
                </form>
            </div>
        </Master>
    );
}
