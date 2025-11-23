import React, { useRef, useState, useEffect, useMemo } from "react";
import { Upload, X, Eye } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";
import { storagePath } from "@/Utils/helpers";

interface ImageFile {
    id: string;
    file?: File;
    preview: string;
    name?: string;
    size?: string;
    isExisting?: boolean;
}

interface ImageUploaderProps {
    label?: string;
    required?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    value: File[];
    existingImages?: string[];
    onChange: (files: File[]) => void;
    onRemoveExisting?: (path: string) => void;
    error?: string;
    accept?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    label = "Images",
    required = false,
    multiple = true,
    maxFiles = 10,
    value = [],
    existingImages,
    onChange,
    onRemoveExisting,
    error,
    accept = "image/*",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<ImageFile[]>([]);

    // CRITICAL FIX: Memoize existingImages to prevent infinite loop
    // This ensures 'stableExisting' only changes if the actual paths change, not just on re-renders.
    const stableExisting = useMemo(
        () => existingImages || [],
        [JSON.stringify(existingImages)]
    );

    useEffect(() => {
        // 1. Map Simple Strings (Existing Images)
        const existingPreviews: ImageFile[] = stableExisting.map((path) => ({
            id: path,
            preview: path,
            name: path.split("/").pop(),
            isExisting: true,
        }));

        // 2. Map File Objects (New Uploads)
        const newFilePreviews: ImageFile[] = value.map((file) => ({
            id: file.name + file.size,
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: formatFileSize(file.size),
            isExisting: false,
        }));

        setImagePreviews([...existingPreviews, ...newFilePreviews]);

        // Cleanup
        return () => {
            newFilePreviews.forEach((p) => URL.revokeObjectURL(p.preview));
        };
    }, [value, stableExisting]); // Depend on the stable version

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const currentTotal = (stableExisting.length || 0) + value.length;

        if (files.length + currentTotal > maxFiles) {
            alert(`You can only upload up to ${maxFiles} images`);
            return;
        }

        const allNewFiles = [...value, ...files];
        onChange(allNewFiles);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (id: string, isExisting: boolean) => {
        if (isExisting) {
            if (onRemoveExisting) onRemoveExisting(id);
        } else {
            const imageToRemove = imagePreviews.find((img) => img.id === id);
            if (imageToRemove && imageToRemove.file) {
                const updatedFiles = value.filter(
                    (f) => f !== imageToRemove.file
                );
                onChange(updatedFiles);
            }
        }
    };

    // UI Helpers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        );
        if (files.length > 0) {
            const dt = new DataTransfer();
            files.forEach((f) => dt.items.add(f));
            if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                handleFileSelect({ target: fileInputRef.current } as any);
            }
        }
    };

    return (
        <div className="space-y-3">
            {label && (
                <InputLabel
                    htmlFor="image-upload"
                    value={label}
                    required={required}
                />
            )}
            <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 ${
                    error ? "border-red-300" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">
                        Drop images here or click to upload
                    </p>
                    <p className="text-xs text-gray-500">
                        {imagePreviews.length} / {maxFiles} files selected
                    </p>
                </div>
            </div>
            {error && <InputError message={error} />}
            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((image) => (
                        <div
                            key={image.id}
                            className="relative group border rounded-lg overflow-hidden bg-gray-100 aspect-square"
                        >
                            <img
                                src={
                                    image.isExisting
                                        ? storagePath(image.preview)
                                        : image.preview
                                }
                                alt={image.name || "Image"}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="text-white text-center p-2">
                                    {image.isExisting ? (
                                        <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                                            Existing
                                        </span>
                                    ) : (
                                        <p className="text-xs">{image.size}</p>
                                    )}
                                </div>
                            </div>
                            <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                            image.isExisting
                                                ? storagePath(image.preview)
                                                : image.preview,
                                            "_blank"
                                        );
                                    }}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    <Eye size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(
                                            image.id,
                                            !!image.isExisting
                                        );
                                    }}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
