import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
    cart: Record<string, CartItem>;
    isOpen: boolean;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
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

            addToCart: (product: Product, quantity: number = 1) => {
                set((state) => {
                    const key = String(product.id);
                    const existingItem = state.cart[key];
                    const newQuantity = existingItem
                        ? existingItem.quantity + quantity
                        : quantity;

                    return {
                        cart: {
                            ...state.cart,
                            [key]: {
                                product_id: product.id,
                                name: product.name,
                                price: product.sale_price,
                                quantity: newQuantity,
                                image: product.images?.[0] || null,
                            },
                        },
                        isOpen: true,
                    };
                });
            },

            removeFromCart: (productId: number) => {
                set((state) => {
                    const newCart = { ...state.cart };
                    delete newCart[String(productId)];
                    return { cart: newCart };
                });
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity < 1) return;
                set((state) => {
                    const key = String(productId);
                    if (!state.cart[key]) return state;
                    return {
                        cart: {
                            ...state.cart,
                            [key]: {
                                ...state.cart[key],
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
