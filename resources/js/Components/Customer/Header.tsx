import React, { useCallback, useState, useRef, useEffect } from "react";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import {
    ShoppingCart,
    Menu,
    User,
    MessageCircle,
    Search,
    X,
    Loader2,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { debounce, storagePath } from "@/Utils/helpers";

interface HeaderProps {
    onCartClick: () => void;
    onMenuClick: () => void;
}

interface SearchProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    stock: number;
    in_stock: boolean;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced search function using Axios
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            if (query.trim().length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                setSearchError(null);
                return;
            }

            try {
                setIsSearching(true);
                setSearchError(null);

                const response = await axios.get(route("api.search"), {
                    params: { q: query },
                });

                setSearchResults(response.data);
                setShowResults(true);
            } catch (error: any) {
                console.error("Search error:", error);
                setSearchError(
                    error.response?.status === 404
                        ? "Search endpoint not found. Please check the route."
                        : "Failed to search products. Please try again."
                );
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        []
    );

    // Handle search input change (active search)
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setSearchError(null);

        if (value.trim().length >= 2) {
            setIsSearching(true);
            debouncedSearch(value);
        } else {
            setSearchResults([]);
            setShowResults(false);
            setIsSearching(false);
        }
    };

    // Handle manual search submit (on Enter or button click)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.visit(route("products.search"), {
                data: { q: searchQuery },
                preserveState: false,
                preserveScroll: false,
            });
            setIsMobileSearchOpen(false);
            setShowResults(false);
        }
    };

    // Handle product selection from search results
    const handleProductSelect = (product: SearchProduct) => {
        router.visit(route("products.show", product.slug));
        setShowResults(false);
        setIsMobileSearchOpen(false);
        setSearchQuery("");
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setShowResults(false);
        setIsSearching(false);
        setSearchError(null);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-BD", {
            style: "currency",
            currency: "BDT",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Search results content
    const renderSearchResults = () => {
        if (searchError) {
            return (
                <div className="text-center py-8 text-red-500">
                    <X className="h-8 w-8 mx-auto text-red-400 mb-2" />
                    <p className="text-sm">{searchError}</p>
                </div>
            );
        }

        if (isSearching) {
            return (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                    <span className="ml-2 text-gray-600">Searching...</span>
                </div>
            );
        }

        if (searchResults.length > 0) {
            return (
                <div className="py-2">
                    {searchResults.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductSelect(product)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={storagePath(product.image)}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {product.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-semibold text-indigo-600">
                                        {formatPrice(product.price)}
                                    </span>
                                    {!product.in_stock && (
                                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (searchQuery.length >= 2) {
            return (
                <div className="text-center py-8 text-gray-500">
                    <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p>No products found</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Try different keywords
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left: Logo & Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onMenuClick}
                                className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900"
                            >
                                <Menu size={24} />
                            </button>
                            <Link
                                href="/"
                                className="flex-shrink-0 flex items-center"
                            >
                                <ApplicationLogo
                                    applicationName="Paikari World"
                                    size="md"
                                />
                                <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                                    Paikari World
                                </span>
                            </Link>
                        </div>

                        {/* Center: Desktop Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                            <div ref={searchRef} className="relative w-full">
                                <form
                                    onSubmit={handleSearch}
                                    className="relative"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        onFocus={() =>
                                            searchQuery.length >= 2 &&
                                            setShowResults(true)
                                        }
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                                        placeholder="Search products... (type to search)"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </form>

                                {/* Search Results Dropdown */}
                                {showResults && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                        {renderSearchResults()}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Mobile Search Button */}
                            <button
                                onClick={() => setIsMobileSearchOpen(true)}
                                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <Search size={20} />
                            </button>

                            <Link
                                href={route("login")}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <User size={20} />
                            </Link>

                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                                <MessageCircle size={20} />
                            </button>

                            <button
                                onClick={onCartClick}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <span className="hidden sm:inline text-sm font-medium">
                                    Cart
                                </span>
                                <div className="relative">
                                    <ShoppingCart size={20} />
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                        0
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Search Modal */}
            {isMobileSearchOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileSearchOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="absolute top-0 left-0 right-0 bg-white shadow-lg max-h-screen overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div ref={searchRef} className="flex-1">
                                    <form
                                        onSubmit={handleSearch}
                                        className="relative"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                handleSearchChange(
                                                    e.target.value
                                                )
                                            }
                                            autoFocus
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                                            placeholder="Search products..."
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={handleClearSearch}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </form>
                                </div>
                                <button
                                    onClick={() => setIsMobileSearchOpen(false)}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search Results */}
                        <div className="flex-1 overflow-y-auto">
                            {renderSearchResults()}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
