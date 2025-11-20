export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

export type Category = {
    id: number;
    title: string;
    slug: string;
    image: string;
};

export type Supplier = {
    id: number;
    name: string;
};

export type ProductAttribute = {
    id: number;
    name: string;
};

export interface Product {
    id: number;
    name: string;
    description: string;
    images: string[];
    purchase_price: number;
    sale_price: number;
    moq_price?: number;
    uan_price?: number;
    stock: number;
    category_id?: number;
    supplier_id?: number;
    category?: Category;
    supplier?: Supplier;
    variations?: ProductVariation[];
    qty_prices?: QtyPrice[];
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    title: string;
    description?: string;
}

export interface Supplier {
    id: number;
    name: string;
    contact_info?: string;
}

export interface ProductVariation {
    id: number;
    attribute_id: number;
    value: string;
    stock?: number;
    price?: number;
    attribute?: ProductAttribute;
}

export interface ProductAttribute {
    id: number;
    name: string;
    values?: string[];
}

export interface QtyPrice {
    qty: number;
    price: number;
}

export interface ProductsIndexProps {
    products: Product[];
    categories?: Category[];
    suppliers?: Supplier[];
    filters?: {
        category?: string;
        stock_status?: string;
        search?: string;
    };
}

export interface CreatePageProps extends PageProps {
    categories: Category[];
    suppliers: Supplier[];
    attributes: ProductAttribute[];
    products: Product[];
    productVariations: ProductVariation[];
}
