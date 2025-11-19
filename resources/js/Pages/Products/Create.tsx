import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import Master from "@/Layouts/Master";
import { useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        price: "",
        supplier: "",
    });
    return (
        <Master
            title="Create Product"
            head={<Header title="Create Product" showUserMenu={true} />}
        >
            <div className="lg:p-6 sm:p-2">
                <CollapsibleSection
                    title="General Information"
                    defaultOpen={true}
                >
                    <Card>
                        <CardContent padding="lg">
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                                <div className="w-full">
                                    <InputLabel htmlFor="price" value="Price" />
                                    <TextInput
                                        id="price"
                                        name="price"
                                        placeholder="Enter your price"
                                        autoComplete="price"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        required
                                        className="mt-1 w-full"
                                    />
                                </div>

                                <div className="w-full">
                                    <InputLabel
                                        htmlFor="supplier"
                                        value="Supplier"
                                    />
                                    <TextInput
                                        id="supplier"
                                        name="supplier"
                                        placeholder="Enter your supplier"
                                        autoComplete="supplier"
                                        value={data.supplier}
                                        onChange={(e) =>
                                            setData("supplier", e.target.value)
                                        }
                                        required
                                        className="mt-1 w-full"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </CollapsibleSection>
            </div>
        </Master>
    );
}
