import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Hero from "@/Components/Customer/Hero";
import CategorySlider from "@/Components/Customer/CategorySlider";
import ProductGrid from "@/Components/Customer/ProductGrid";
import { Category, Product } from "@/types";

interface HomeProps {
    categories: Category[];
    products: {
        data: Product[];
        links: any[];
    };
}

const Home: React.FC<HomeProps> = ({ categories, products }) => {
    return (
        <CustomerLayout title="Home">
            {/* Hero Section */}
            <Hero />

            {/* Categories */}
            <div className="bg-white border-b border-gray-100">
                <CategorySlider categories={categories} />
            </div>

            {/* Products */}
            <div className="bg-gray-50 min-h-screen">
                <ProductGrid products={products} />
            </div>
        </CustomerLayout>
    );
};

export default Home;
