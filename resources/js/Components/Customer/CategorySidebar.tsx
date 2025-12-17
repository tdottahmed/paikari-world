import React from "react";
import {
    X,
    ChevronRight,
    GalleryThumbnails,
    TreeDeciduous,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Image from "../Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";

interface CategorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Category {
    id: number;
    title: string;
    slug: string;
    image: string | null;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    isOpen,
    onClose,
}) => {
    const { categories } =
        usePage<PageProps<{ categories: Category[] }>>().props;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900">
                            {" "}
                            Categories{" "}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Category List */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {categories && categories.length > 0 ? (
                            <ul className="space-y-1">
                                <li>
                                    <Link
                                        href={route("products.index")}
                                        className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors group"
                                        onClick={onClose}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-bold">
                                                <TreeDeciduous size={16} />
                                            </div>
                                            <span className="font-medium">
                                                All Products
                                            </span>
                                        </div>
                                        <ChevronRight
                                            size={16}
                                            className="text-gray-300 group-hover:text-primary-500 transition-colors"
                                        />
                                    </Link>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={route(
                                                "products.category",
                                                category.slug
                                            )}
                                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors group"
                                            onClick={onClose}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={getAssetUrl(
                                                        category.image
                                                    )}
                                                    alt={category.title}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                                />
                                                <span className="font-medium">
                                                    {" "}
                                                    {category.title}{" "}
                                                </span>
                                            </div>
                                            <ChevronRight
                                                size={16}
                                                className="text-gray-300 group-hover:text-primary-500 transition-colors"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <p>No categories found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategorySidebar;
