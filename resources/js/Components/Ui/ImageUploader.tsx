import React, { useRef, useState } from "react";
import { Upload, X, Eye } from "lucide-react";
import InputLabel from "./InputLabel";
import InputError from "./InputError";

interface ImageFile {
    id: string;
    file: File;
    preview: string;
    name: string;
    size: string;
}

interface ImageUploaderProps {
    label?: string;
    required?: boolean;
    multiple?: boolean;
    maxFiles?: number;
    value: File[];
    onChange: (files: File[]) => void;
    error?: string;
    accept?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    label = "Images",
    required = false,
    multiple = true,
    maxFiles = 10,
    value = [],
    onChange,
    error,
    accept = "image/*",
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreviews, setImagePreviews] = useState<ImageFile[]>([]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length + value.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} images`);
            return;
        }

        // Create previews for new files
        const newImagePreviews: ImageFile[] = files.map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
            size: formatFileSize(file.size),
        }));

        const allPreviews = [...imagePreviews, ...newImagePreviews];
        setImagePreviews(allPreviews);

        // Update parent component with all files
        const allFiles = [...value, ...files];
        onChange(allFiles);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeImage = (id: string) => {
        const previewToRemove = imagePreviews.find((img) => img.id === id);
        const updatedPreviews = imagePreviews.filter((img) => img.id !== id);

        setImagePreviews(updatedPreviews);

        // Update parent files array
        if (previewToRemove) {
            const updatedFiles = value.filter(
                (file) => file !== previewToRemove.file
            );
            onChange(updatedFiles);
        }

        // Revoke object URL to avoid memory leaks
        if (previewToRemove) {
            URL.revokeObjectURL(previewToRemove.preview);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.add("border-blue-500", "bg-blue-50");
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

        const files = Array.from(event.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        );

        if (files.length > 0) {
            const dataTransfer = new DataTransfer();
            files.forEach((file) => dataTransfer.items.add(file));

            if (fileInputRef.current) {
                fileInputRef.current.files = dataTransfer.files;
                handleFileSelect({ target: fileInputRef.current } as any);
            }
        }
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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

            {/* Drop Zone */}
            <div
                className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 ${
                    error ? "border-red-300" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
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
                    <p className="text-xs text-gray-500 mt-1">
                        {multiple
                            ? `Upload up to ${maxFiles} images`
                            : "Upload one image"}{" "}
                        • PNG, JPG, GIF, WEBP
                    </p>
                    <p className="text-xs text-gray-500">
                        {imagePreviews.length} / {maxFiles} files selected
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && <InputError message={error} />}

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((image) => (
                        <div
                            key={image.id}
                            className="relative group border rounded-lg overflow-hidden bg-gray-100"
                        >
                            <img
                                src={image.preview}
                                alt={image.name}
                                className="w-full h-24 object-cover"
                            />

                            {/* Image Info Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="text-white text-center p-2">
                                    <p className="text-xs font-medium truncate">
                                        {image.name}
                                    </p>
                                    <p className="text-xs">{image.size}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(image.preview, "_blank");
                                    }}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    title="View full size"
                                >
                                    <Eye size={12} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(image.id);
                                    }}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    title="Remove image"
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
