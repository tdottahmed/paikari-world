import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product, ProductVariation } from "@/types";

// Helper to generate unique cart key
const generateCartKey = (productId: number, variations: ProductVariation[] = []) => {
    if (!variations || variations.length === 0) return String(productId);
    const sortedVarIds = variations.map(v => v.id).sort((a, b) => a - b);
    return `${productId}-${sortedVarIds.join("-")}`;
};

interface CartState {
    cart: Record<string, CartItem & { cart_id: string }>;
    isOpen: boolean;
    addToCart: (
        product: Product,
        quantity?: number,
        variations?: ProductVariation[]
    ) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    getCartTotal: () => number;
    getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: {},
            isOpen: false,

            addToCart: (
                product: Product,
                quantity: number = 1,
                variations: ProductVariation[] = []
            ) => {
                set((state) => {
                    const key = generateCartKey(product.id, variations);
                    const existingItem = state.cart[key];
                    const newQuantity = existingItem
                        ? existingItem.quantity + quantity
                        : quantity;

                    // Calculate stock logic
                    let stock = Number(product.stock);
                    if (variations && variations.length > 0) {
                        const variationStocks = variations
                            .map((v) => (v.stock ?? product.stock))
                            .map((s) => Number(s))
                            .filter(
                                (s) =>
                                    !isNaN(s)
                            );
                        if (variationStocks.length > 0) {
                            stock = Math.min(Number(product.stock), ...variationStocks);
                        }
                    }

                    // Calculate price logic
                    let price = Number(product.sale_price);
                    if (variations && variations.length > 0) {
                        const varPrices = variations
                            .map((v) =>
                                v.price ? parseFloat(String(v.price)) : null
                            )
                            .filter((p) => p !== null) as number[];

                        if (varPrices.length > 0) {
                            price = Math.max(...varPrices);
                        }
                    }

                    return {
                        cart: {
                            ...state.cart,
                            [key]: {
                                cart_id: key,
                                product_id: product.id,
                                name: product.name,
                                price: price,
                                stock: stock,
                                quantity: newQuantity,
                                image: product.images?.[0] || null,
                                is_preorder: product.is_preorder,
                                variations: variations,
                                category_id: product.category_id,
                                min_order_qty: product.category?.min_order_qty,
                                add_cart_qty: product.category?.add_cart_qty,
                            },
                        },
                        isOpen: window.innerWidth >= 768,
                    };
                });
            },

            removeFromCart: (cartId: string) => {
                set((state) => {
                    const newCart = { ...state.cart };
                    delete newCart[cartId];
                    return { cart: newCart };
                });
            },

            updateQuantity: (cartId: string, quantity: number) => {
                if (quantity < 1) return;
                set((state) => {
                    if (!state.cart[cartId]) return state;
                    return {
                        cart: {
                            ...state.cart,
                            [cartId]: {
                                ...state.cart[cartId],
                                quantity: quantity,
                            },
                        },
                    };
                });
            },

            clearCart: () => set({ cart: {} }),

            setIsOpen: (isOpen: boolean) => set({ isOpen }),

            getCartTotal: () => {
                const state = get();
                return Object.values(state.cart).reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            getCartCount: () => {
                const state = get();
                return Object.values(state.cart).reduce(
                    (count, item) => count + item.quantity,
                    0
                );
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
