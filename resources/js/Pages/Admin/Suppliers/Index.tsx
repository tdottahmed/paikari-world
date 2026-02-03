import React, { useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Package, Truck, Phone, Mail } from "lucide-react";
import { Supplier } from "@/types";

interface Props {
    suppliers: (Supplier & { products_count: number })[];
}

const Index: React.FC<Props> = ({ suppliers }) => {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this supplier?")) {
            setDeletingId(id);
            router.delete(route("admin.suppliers.destroy", id), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <Master
            title="Suppliers"
            head={<Header title="Suppliers" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Suppliers
                        </h1>
                        <p className="text-sm md:text-base text-gray-400 mt-1">
                            Manage your product suppliers
                        </p>
                    </div>

                    <Link
                        href={route("admin.suppliers.create")}
                        className="w-full md:w-auto"
                    >
                        <PrimaryButton className="w-full md:w-auto flex items-center justify-center gap-2">
                            <Plus size={18} />
                            <span> Add Supplier </span>
                        </PrimaryButton>
                    </Link>
                </div>

                {/* Suppliers Grid */}
                {suppliers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {suppliers.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="bg-[#0E1614] rounded-lg border border-[#1E2826] overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                            >
                                {/* Supplier Icon / Placeholder */}
                                <div className="aspect-video bg-[#0E1614] relative border-b border-[#1E2826] flex items-center justify-center">
                                    <div className="w-16 h-16 bg-[#151F1D] rounded-full flex items-center justify-center text-[#2DE3A7]">
                                        <Truck size={32} />
                                    </div>
                                </div>

                                {/* Supplier Info */}
                                <div className="p-4 flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {supplier.name}
                                    </h3>

                                    <div className="space-y-2">
                                        {supplier.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Mail
                                                    size={14}
                                                    className="shrink-0"
                                                />
                                                <span className="truncate">
                                                    {" "}
                                                    {supplier.email}{" "}
                                                </span>
                                            </div>
                                        )}
                                        {supplier.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Phone
                                                    size={14}
                                                    className="shrink-0"
                                                />
                                                <span>{supplier.phone} </span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 pt-2 border-t border-[#1E2826]">
                                            <Package
                                                size={14}
                                                className="shrink-0"
                                            />
                                            <span>
                                                {supplier.products_count || 0}{" "}
                                                product
                                                {supplier.products_count !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 pb-4 flex gap-2 mt-auto">
                                    <Link
                                        href={route(
                                            "admin.suppliers.edit",
                                            supplier.id,
                                        )}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                        <span> Edit </span>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            handleDelete(supplier.id)
                                        }
                                        disabled={deletingId === supplier.id}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-[#0E1614]/50 rounded-lg border-2 border-dashed border-[#1E2826]">
                        <Truck
                            size={48}
                            className="mx-auto text-gray-400 mb-4"
                        />
                        <p className="text-gray-400 mb-4">
                            No suppliers found.Add your first supplier to get
                            started.
                        </p>
                        <Link href={route("admin.suppliers.create")}>
                            <PrimaryButton className="inline-flex items-center gap-2">
                                <Plus size={18} />
                                <span> Add Supplier </span>
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        </Master>
    );
};

export default Index;
