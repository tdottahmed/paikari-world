import { useState } from "react";
import { ZoomInIcon, XIcon } from "lucide-react";
import { filePath, storagePath } from "@/Utils/helpers";

interface ImageGalleryProps {
    images: Array<{
        id: string;
        url: string;
        alt?: string;
    }>;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <div
                        key={image.id}
                        className="relative group cursor-pointer aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                        onClick={() => setSelectedImage(image.url)}
                    >
                        <img
                            src={storagePath(filePath(image.url))}
                            alt={image.alt || `Product image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                            <ZoomInIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                    >
                        <XIcon size={24} />
                    </button>
                    <div className="max-w-4xl max-h-full">
                        <img
                            src={storagePath(filePath(selectedImage))}
                            alt="Enlarged product view"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
