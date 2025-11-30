import React from "react";
import { Link } from "@inertiajs/react";
import { ShoppingCart, Trash2, Plus, Minus, Check } from "lucide-react";
import { storagePath, isNewProduct, formatPrice } from "@/Utils/helpers";
import { Product } from "@/types";
import Image from "../Ui/Image";
import { useCartStore } from "@/Stores/useCartStore";
import { useDebounce } from "@/Hooks/useDebounce";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { cart, addToCart, removeFromCart, updateQuantity } = useCartStore();
    const cartItem = cart[String(product.id)];
    const isInCart = !!cartItem;
    const [quantity, setQuantity] = React.useState(cartItem?.quantity || 0);
    const debouncedQuantity = useDebounce(quantity, 300);

    React.useEffect(() => {
        setQuantity(cartItem?.quantity || 0);
    }, [cartItem?.quantity]);

    React.useEffect(() => {
        if (debouncedQuantity > 0 && cartItem && debouncedQuantity !== cartItem.quantity) {
            updateQuantity(product.id, debouncedQuantity);
        }
    }, [debouncedQuantity, updateQuantity, product.id]);

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(product.id);
    };

    return (
        <div className= "group bg-white rounded-xl border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative" >
        {/* Badges */ }
        < div className = "absolute top-3 left-3 z-10 flex gap-2" >
        {
            product.stock > 0 ? (
                <span className= "bg-green-300 text-green-900 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1" >
                <Check size={ 10 } strokeWidth = { 4} />
                    In Stock
                        </span>
                ) : (
    <span className= "bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md" >
    Out of Stock
        </span>
                )}
</div>

{/* NEW Badge - Show if created within last 30 days */ }
{
    isNewProduct(product.created_at) && (
        <div className="absolute top-3 right-3 z-10" >
            <span className="bg-cyan-300 text-cyan-900 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1" >
                <svg
                            width="10"
    height = "10"
    viewBox = "0 0 24 24"
    fill = "none"
    xmlns = "http://www.w3.org/2000/svg"
    className = "w-3 h-3"
        >
        <path
                                d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
    fill = "currentColor"
        />
        </svg>
    NEW
        </span>
        </div>
            )
}

{/* Image Container */ }
<div className="relative aspect-square bg-gray-100 overflow-hidden" >
    <Link href={ route("products.show", product.slug) }>
        <Image
                        src={ storagePath(product.images?.[0]) }
alt = { product.name }
className = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
    </Link>
    </div>

{/* Content */ }
<div className="p-1 md:p-4 flex-1 flex flex-col" >
    <Link
                    href={ route("products.show", product.slug) }
className = "block mb-1"
    >
    <h3 className="text-sm font-medium text-gray-900 px-2" >
        { product.name }
        </h3>
        </Link>
        < div className = "mb-2 md:mb-4 px-2" >
            <span className="text-l font-bold text-gray-900" >
                { formatPrice(product.sale_price) }
                </span>
                </div>

                < div className = "mt-auto" >
                    {
                        isInCart?(
                        <div className = "flex items-center justify-between" >
                                <button
                                onClick={ handleRemoveFromCart }
                                className = "w-10 h-10 flex items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                >
                                <Trash2 size={ 18} />
                    </button>

                    < div className = "flex items-center bg-gray-100 rounded-full px-1" >
                        <button
                                    onClick={
    () =>
        handleUpdateQuantity(quantity - 1)
}
className = "w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-full hover:bg-white transition-colors"
disabled = { quantity <= 1}
                                >
    <Minus size={ 16 } />
        </button>
        < span className = "w-8 text-center text-sm font-bold text-gray-900" >
            { quantity }
            </span>
            < button
onClick = {() =>
handleUpdateQuantity(quantity + 1)
                                    }
className = "w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-full hover:bg-white transition-colors"
    >
    <Plus size={ 16 } />
        </button>
        </div>
        </div>
                    ) : (
    <button
                            onClick= { handleAddToCart }
disabled = { product.stock <= 0 }
className = {`w-full py-3 rounded-3xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${product.stock > 0
    ? "bg-[#1A1B2E] text-white hover:bg-[#2D2E45] shadow-lg hover:shadow-xl"
    : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
                        >
    Add to cart
        </button>
                    )}
</div>
    </div>
    </div>
    );
};

export default ProductCard;
