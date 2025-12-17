import { useState, useEffect } from "react";
import { ZoomInIcon, XIcon } from "lucide-react";
import { filePath, getAssetUrl } from "@/Utils/helpers";

interface ImageGalleryProps {
    images: Array<{
        id: string;
        url: string;
        alt?: string;
    }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [featuredImage, setFeaturedImage] = useState<string | null>(null);

    useEffect(() => {
        if (images.length > 0) {
            setFeaturedImage(images[0].url);
        }
    }, [images]);

    if (!images || images.length === 0) return null;

    return (
        <div className= "space-y-4" >
        {/* Featured Image */ }
        < div
    className = "relative group cursor-pointer aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    onClick = {() => setSelectedImage(featuredImage)
}
            >
    <img
                    src={ getAssetUrl(filePath(featuredImage)) }
alt = "Featured product image"
className = "w-full h-full object-contain p-2"
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center" >
        <ZoomInIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
            </div>

{/* Thumbnails */ }
{
    images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" >
        {
            images.map((image) => (
                <div
                            key= { image.id }
                            className = {`
                                relative cursor-pointer aspect-square bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden border-2 transition-all
                                ${featuredImage === image.url
                        ? "border-emerald-500 ring-1 ring-emerald-500"
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }
                            `}
    onClick = {() => setFeaturedImage(image.url)
}
                        >
    <img
                                src={ getAssetUrl(filePath(image.url)) }
alt = { image.alt || "Product thumbnail" }
className = "w-full h-full object-cover"
    />
    </div>
                    ))}
</div>
            )}

{/* Image Modal */ }
{
    selectedImage && (
        <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
    onClick = {() => setSelectedImage(null)
}
                >
    <button
                        onClick={ () => setSelectedImage(null) }
className = "absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 rounded-full p-2 transition-colors"
    >
    <XIcon size={ 24 } />
        </button>
        < div
className = "max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
onClick = {(e) => e.stopPropagation()}
                    >
    <img
                            src={ getAssetUrl(filePath(selectedImage)) }
alt = "Enlarged product view"
className = "max-w-full max-h-full object-contain rounded-lg shadow-2xl"
    />
    </div>
    </div>
            )}
</div>
    );
}
