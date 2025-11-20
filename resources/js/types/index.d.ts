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

export interface CreatePageProps extends PageProps {
    categories: Category[];
    suppliers: Supplier[];
    attributes: ProductAttribute[];
}
