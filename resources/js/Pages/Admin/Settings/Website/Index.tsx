import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import ImageUploader from "@/Components/Ui/ImageUploader";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { Head, useForm } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface DeliveryCharge {
    id?: number;
    name: string;
    cost: number | string;
    duration: string;
}

interface WebsiteSetting {
    id: number;
    banner_active: boolean;
    banner_images: string[] | null;
}

interface Props {
    setting: WebsiteSetting;
    deliveryCharges: DeliveryCharge[];
}

const BannerForm = ({ setting }: { setting: WebsiteSetting }) => {
    const [existingImages, setExistingImages] = useState<string[]>(
        setting.banner_images || []
    );
    const { data, setData, post, processing, errors } = useForm({
        type: "banner",
        banner_active: setting.banner_active,
        banner_images: [] as File[],
        existing_banner_images: setting.banner_images || [],
        deleted_images: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("banner_images", []);
            },
        });
    };
    const handleImagesChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("banner_images", files);
        } else if (files) {
            setData("banner_images", [files]);
        } else {
            setData("banner_images", []);
        }
    };

    const handleRemoveExistingImage = (path: string) => {
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;
        setData("deleted_images", [...data.deleted_images, cleanPath]);
        setExistingImages((prev) => prev.filter((img) => img !== cleanPath));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Banner Settings </CardTitle>
                        <button
                            type="button"
                            onClick={() =>
                                setData("banner_active", !data.banner_active)
                            }
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                                data.banner_active
                                    ? "bg-[#2DE3A7]"
                                    : "bg-gray-600"
                            }`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                    data.banner_active ? "left-7" : "left-1"
                                }`}
                            />
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImageUploader
                        label="Banner Images"
                        multiple={true}
                        value={data.banner_images}
                        existingImages={existingImages.map((img) => `/${img}`)}
                        onChange={handleImagesChange}
                        onRemoveExisting={handleRemoveExistingImage}
                        error={errors.banner_images as string}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Banner Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

const DeliveryChargeForm = ({ charges }: { charges: DeliveryCharge[] }) => {
    const { data, setData, post, processing } = useForm({
        type: "delivery",
        delivery_charges: charges.map((c) => ({ ...c })),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            preserveScroll: true,
            onSuccess: () =>
                toast.success("Delivery charges updated successfully"),
        });
    };

    const addCharge = () => {
        setData("delivery_charges", [
            ...data.delivery_charges,
            { name: "", cost: "", duration: "" },
        ]);
    };

    const removeCharge = (index: number) => {
        const newCharges = [...data.delivery_charges];
        newCharges.splice(index, 1);
        setData("delivery_charges", newCharges);
    };

    const updateCharge = (
        index: number,
        field: keyof DeliveryCharge,
        value: string | number
    ) => {
        const newCharges = [...data.delivery_charges];
        newCharges[index] = { ...newCharges[index], [field]: value };
        setData("delivery_charges", newCharges);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Delivery Charges </CardTitle>
                        <button
                            type="button"
                            onClick={addCharge}
                            className="bg-[#151F1D] border border-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-[#1A2624] hover:border-[#2DE3A7] transition-all flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} />
                            Add Charge
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.delivery_charges.map((charge, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-start bg-[#151F1D] p-4 rounded-lg border border-gray-800"
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">
                                                Area Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Inside Dhaka"
                                                value={charge.name}
                                                onChange={(e) =>
                                                    updateCharge(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">
                                                Cost
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={charge.cost}
                                                onChange={(e) =>
                                                    updateCharge(
                                                        index,
                                                        "cost",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2-3 Days"
                                                value={charge.duration}
                                                onChange={(e) =>
                                                    updateCharge(
                                                        index,
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCharge(index)}
                                    className="mt-6 p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {data.delivery_charges.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                No delivery charges added yet.
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Delivery Charges"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default function Index({ setting, deliveryCharges }: Props) {
    return (
        <Master
            title="Website"
            head={<Header title="Website" showUserMenu={true} />}
        >
            <Head title="Website" />
            <div className="p-2 md:p-6 max-w-8xl mx-auto space-y-6">
                <BannerForm setting={setting} />
                <DeliveryChargeForm charges={deliveryCharges} />
            </div>
        </Master>
    );
}
