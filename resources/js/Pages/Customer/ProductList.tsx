import React from "react";
import { Head } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import ProductGrid from "@/Components/Customer/ProductGrid";
import { Category, PaginatedData, Product } from "@/types";

interface ProductListProps {
    products: PaginatedData<Product>;
    category?: Category;
}

const ProductList: React.FC<ProductListProps> = ({ products, category }) => {
    const title = category
        ? `${category.title} - Paikari World`
        : "All Products - Paikari World";

    return (
        <CustomerLayout title={title}>
            <Head title={title} />
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        {category ? category.title : "All Products"}
                    </h1>
                    {category && (
                        <p className="mt-2 text-sm text-gray-500">
                            Browse our collection of {category.title}
                        </p>
                    )}
                </div>
            </div>

            <ProductGrid products={products} />
        </CustomerLayout>
    );
};

export default ProductList;
