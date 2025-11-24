import React, { useRef } from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "@/types"; // Assuming Category type exists or we define a local one

interface CategorySliderProps {
    categories: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ categories }) => {
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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                    {" "}
                    Categories{" "}
                </h2>
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
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <Link
                    href={route("products.index")}
                    className="flex flex-col items-center gap-3 min-w-[80px] snap-start group cursor-pointer"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 border-2 border-transparent group-hover:border-indigo-500 transition-all overflow-hidden flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-400">
                            {" "}
                            ALL{" "}
                        </span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-indigo-600 transition-colors line-clamp-2 w-20">
                        All Products
                    </span>
                </Link>

                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`} // Assuming route exists or will exist
                        className="flex flex-col items-center gap-3 min-w-[80px] snap-start group cursor-pointer"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 border-2 border-transparent group-hover:border-indigo-500 transition-all overflow-hidden flex items-center justify-center">
                            {category.image ? (
                                <img
                                    src={`/storage/${category.image}`}
                                    alt={category.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">
                                    {category.title.charAt(0)}
                                </span>
                            )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 text-center group-hover:text-indigo-600 transition-colors line-clamp-2 w-20">
                            {category.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategorySlider;
