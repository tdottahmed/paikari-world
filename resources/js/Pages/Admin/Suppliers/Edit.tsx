import React, { FormEvent, useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import Card from "@/Components/Ui/Card";
import { Supplier } from "@/types";

interface EditProps {
    supplier: Supplier;
}

const Edit: React.FC<EditProps> = ({ supplier }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        contact_info: supplier.contact_info || "",
    });

    const [deleting, setDeleting] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route("admin.suppliers.update", supplier.id));
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this supplier?")) {
            setDeleting(true);
            router.delete(route("admin.suppliers.destroy", supplier.id));
        }
    };

    return (
        <Master
            title="Edit Supplier"
            head={<Header title="Edit Supplier" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 max-w-8xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route("admin.suppliers.index")}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Suppliers</span>
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Edit Supplier
                        </h1>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                <Card className="p-6 space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Enter supplier name"
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Enter email address"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput
                                id="phone"
                                name="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Enter phone number"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="address" value="Address" />
                            <TextInput
                                id="address"
                                name="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Enter address"
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="contact_info"
                                value="Contact Info"
                            />
                            <TextInput
                                id="contact_info"
                                name="contact_info"
                                value={data.contact_info}
                                onChange={(e) =>
                                    setData("contact_info", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Enter contact information"
                            />
                            <InputError
                                message={errors.contact_info}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Link
                                href={route("admin.suppliers.index")}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing ? "Updating..." : "Update Supplier"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </Master>
    );
};

export default Edit;
