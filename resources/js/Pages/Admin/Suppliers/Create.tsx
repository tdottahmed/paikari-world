import React, { FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import Card from "@/Components/Ui/Card";

const Create: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        contact_info: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("admin.suppliers.store"));
    };

    return (
        <Master
            title="Create Supplier"
            head={<Header title="Create Supplier" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 max-w-8xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route("admin.suppliers.index")}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span> Back to Suppliers </span>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Create Supplier
                    </h1>
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
                                {processing ? "Creating..." : "Create Supplier"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </Master>
    );
};

export default Create;
