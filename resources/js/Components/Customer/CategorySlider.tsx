import React, { useRef } from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    ChevronRight,
    GalleryHorizontal,
    ListCheck,
} from "lucide-react";
import { Category } from "@/types"; // Assuming Category type exists or we define a local one
import Image from "../Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";

interface CategorySliderProps {
    categories: Category[];
    activeCategory?: Category;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
    categories,
    activeCategory,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 200;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (!categories || categories.length === 0) return null;

    return (
        <div className="relative max-w-7xl mx-auto px-2 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-1 md:gap-4 overflow-x-auto scrollbar-hide snap-x"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <Link
                    href={route("products.index")}
                    className="flex flex-col items-center gap-3 min-w-[80px] snap-start group cursor-pointer"
                >
                    <div
                        className={`w-16 h-16 md:w-20 sm:h-20 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center ${
                            !activeCategory
                                ? "bg-purple-100 border-indigo-600"
                                : "bg-purple-100 border-transparent group-hover:border-indigo-500"
                        }`}
                    >
                        <span
                            className={`text-xs font-bold ${
                                !activeCategory
                                    ? "text-indigo-600"
                                    : "text-gray-400"
                            }`}
                        >
                            <GalleryHorizontal size={32} />
                        </span>
                    </div>
                    <span
                        className={`text-xs sm:text-sm font-medium text-center transition-colors line-clamp-2 w-20 ${
                            !activeCategory
                                ? "text-indigo-600"
                                : "text-gray-700 group-hover:text-indigo-600"
                        }`}
                    >
                        All Products
                    </span>
                </Link>

                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={route("products.category", category.slug)}
                        className="flex flex-col items-center gap-3 min-w-[80px] snap-start group cursor-pointer"
                    >
                        <div
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all overflow-hidden flex items-center justify-center ${
                                activeCategory?.id === category.id
                                    ? "bg-indigo-50 border-indigo-600"
                                    : "bg-gray-100 border-transparent group-hover:border-indigo-500"
                            }`}
                        >
                            <Image
                                src={getAssetUrl(category.image)}
                                alt={category.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span
                            className={`text-xs sm:text-sm font-medium text-center transition-colors line-clamp-2 w-20 ${
                                activeCategory?.id === category.id
                                    ? "text-indigo-600"
                                    : "text-gray-700 group-hover:text-indigo-600"
                            }`}
                        >
                            {category.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySlider;
