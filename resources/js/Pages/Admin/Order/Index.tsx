import React, { useState, useMemo, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import { Order, PaginatedData, PageProps } from "@/types";
import { Printer, Eye, Search as SearchIcon } from "lucide-react";
import Checkbox from "@/Components/Ui/Checkbox";
import Search from "@/Components/Ui/Search";
import SelectInput from "@/Components/Ui/SelectInput";
import ViewToggle from "@/Components/Order/ViewToggle";
import OrderGridItem from "@/Components/Order/OrderGridItem";
import OrderListItem from "@/Components/Order/OrderListItem";
import { useDebounce } from "@/Hooks/useDebounce";

interface Props extends PageProps {
    orders: PaginatedData<Order>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ orders, filters }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState(filters.search || "");
    const debouncedSearch = useDebounce(search, 500);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Active Search Effect
    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) {
            router.get(
                route("admin.orders.index"),
                {
                    search: debouncedSearch,
                    status: filters.status,
                },
                { preserveState: true, preserveScroll: true }
            );
        }
    }, [debouncedSearch]);

    // Load view mode from local storage
    useEffect(() => {
        const savedMode = localStorage.getItem("orderViewMode");
        if (savedMode === "grid" || savedMode === "list") {
            setViewMode(savedMode);
        }
    }, []);

    // Save view mode to local storage
    const handleViewModeChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        localStorage.setItem("orderViewMode", mode);
    };

    // Status tabs
    const statuses = [
        "all",
        "pending",
        "unreachable",
        "preparing",
        "shipping",
        "completed",
        "canceled",
        "returned",
    ];

    // Handle Status Filter
    const handleStatusChange = (status: string) => {
        router.get(
            route("admin.orders.index"),
            {
                search: filters.search,
                status: status === "all" ? undefined : status,
            },
            { preserveState: true }
        );
    };

    // Handle Status Update
    const updateStatus = (order: Order, newStatus: string) => {
        router.post(
            route("admin.orders.update-status", order.id),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional toast notification could go here
                },
            }
        );
    };

    // Selection Logic
    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === orders.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orders.data.map((o) => o.id));
        }
    };

    // Bulk Actions
    const handleBulkDetails = () => {
        router.get(route("admin.orders.bulk-details"), {
            ids: selectedIds.join(","),
        });
    };

    const handleBulkPrint = () => {
        const url = route("admin.orders.bulk-invoice", {
            ids: selectedIds.join(","),
        });
        window.open(url, "_blank");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500 text-black border-yellow-600";
            case "unreachable":
                return "bg-red-500 text-white border-red-600";
            case "preparing":
                return "bg-blue-500 text-white border-blue-600";
            case "shipping":
                return "bg-indigo-500 text-white border-indigo-600";
            case "completed":
                return "bg-green-500 text-black border-green-600";
            case "canceled":
                return "bg-gray-500 text-white border-gray-600";
            case "returned":
                return "bg-orange-500 text-black border-orange-600";
            default:
                return "bg-gray-500 text-white border-gray-600";
        }
    };

    // Status options for SelectInput
    const statusOptions = statuses.map((s) => ({
        value: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
    }));

    const filterStatusOptions = [
        { value: "all", label: "All Statuses" },
        ...statuses
            .filter((s) => s !== "all")
            .map((s) => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1),
            })),
    ];

    return (
        <Master>
            <Head title="Orders" />

            <div className="p-4 md:p-6 space-y-6 pb-24 min-h-screen bg-[#0C1311]">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {" "}
                            Orders{" "}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {" "}
                            Manage and track customer orders{" "}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                        <Search
                            value={search}
                            onChange={setSearch}
                            placeholder="Search orders..."
                            className="w-full md:w-64"
                        />

                        <div className="w-full md:w-48">
                            <SelectInput
                                value={filters.status || "all"}
                                options={filterStatusOptions}
                                onChange={handleStatusChange}
                                placeholder="Filter Status"
                            />
                        </div>

                        <ViewToggle
                            viewMode={viewMode}
                            onChange={handleViewModeChange}
                        />
                    </div>
                </div>

                {/* Selection & Bulk Actions Bar */}
                <div className="flex items-center justify-between bg-[#0E1614] p-4 rounded-lg border border-[#1E2826]">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            name="select-all"
                            checked={
                                selectedIds.length === orders.data.length &&
                                orders.data.length > 0
                            }
                            onChange={toggleSelectAll}
                        />
                        <span className="text-sm text-gray-400">
                            {selectedIds.length > 0
                                ? `${selectedIds.length} Selected`
                                : "Select All"}
                        </span>
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleBulkDetails}
                                className="flex items-center gap-2 px-4 py-2 bg-[#1E2826] text-white rounded-lg font-semibold text-sm hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {" "}
                                    Details{" "}
                                </span>
                            </button>
                            <button
                                onClick={handleBulkPrint}
                                className="flex items-center gap-2 px-4 py-2 bg-[#2DE3A7] text-[#0C1311] rounded-lg font-semibold text-sm hover:bg-[#26c28f] transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    {" "}
                                    Print Invoices{" "}
                                </span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Orders Grid/List */}
                {orders.data.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "space-y-3"
                        }
                    >
                        {orders.data.map((order) =>
                            viewMode === "grid" ? (
                                <OrderGridItem
                                    key={order.id}
                                    order={order}
                                    selected={selectedIds.includes(order.id)}
                                    onSelect={() => toggleSelect(order.id)}
                                    onStatusChange={updateStatus}
                                    statusOptions={statusOptions}
                                    getStatusColor={getStatusColor}
                                />
                            ) : (
                                <OrderListItem
                                    key={order.id}
                                    order={order}
                                    selected={selectedIds.includes(order.id)}
                                    onSelect={() => toggleSelect(order.id)}
                                    onStatusChange={updateStatus}
                                    statusOptions={statusOptions}
                                    getStatusColor={getStatusColor}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-[#0E1614] rounded-xl border border-[#1E2826]">
                        <div className="bg-[#1E2826] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SearchIcon className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white">
                            {" "}
                            No orders found{" "}
                        </h3>
                        <p className="text-gray-500 mt-1">
                            {" "}
                            Try adjusting your search or filters{" "}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {orders.links.length > 3 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex gap-1 bg-[#0E1614] p-2 rounded-lg border border-[#1E2826]">
                            {orders.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                                        link.active
                                            ? "bg-[#2DE3A7] text-[#0C1311] font-bold"
                                            : "text-gray-400 hover:bg-[#1E2826] hover:text-white"
                                    } ${
                                        !link.url &&
                                        "opacity-50 cursor-not-allowed"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Master>
    );
}
