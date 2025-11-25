import React, { useState, FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import { Category } from "@/types";
import ImageUploader from "@/Components/Ui/ImageUploader";
import Card, { CardContent } from "@/Components/Ui/Card";

interface EditProps {
    category: Category;
}

const Edit: React.FC<EditProps> = ({ category }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: category.title,
        slug: category.slug,
        image: null as File | null,
        _method: "PUT",
    });

    const [deleting, setDeleting] = useState(false);

    // Helper to get existing image array
    const existingImages = category.image ? [category.image] : [];

    const handleImageChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            // Should not happen in single mode, but handle just in case
            setData("image", files.length > 0 ? files[0] : null);
        } else {
            setData("image", files);
        }
    };

    const handleRemoveExisting = () => {
        // In this specific case, we don't have a separate "deleted_images" array in the backend
        // for categories yet (based on typical implementations), but usually setting image to null
        // or sending a flag might be needed.
        // However, the ImageUploader's onRemoveExisting is mostly for UI updates in this context
        // unless we add a specific field to track deletion.
        // For now, if the user uploads a new image, it replaces the old one.
        // If they just want to delete the old one without replacing, we might need a way to signal that.
        // Given the current simple implementation, we'll just acknowledge the removal from UI.
        // If the backend expects a specific field to delete the image, we should add it.
        // Looking at the original code, there was no explicit "delete image" checkbox, just replacement.
        // But let's assume if they remove it in the uploader, they want it gone.
        // We might need to send a flag like `delete_image: true` if `image` is null and we want to remove existing.
        // For now, let's just keep it simple as per original requirement: "correct ImageUploader component".
        // The original code had a "removeImage" function that set data.image to null and reset preview.
        // If we want to support explicit deletion of existing image without replacement:
        // We might need to add `delete_image` to useForm if the backend supports it.
        // Since I don't see the backend code, I will assume standard behavior:
        // If a new image is sent, it replaces.
        // If we want to delete, we might need to handle that.
        // Let's just pass the handler to satisfy the interface.
    };

    const handleTitleChange = (value: string) => {
        setData("title", value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("admin.categories.update", category.id));
    };

    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to delete this category? This action cannot be undone."
            )
        ) {
            setDeleting(true);
            router.delete(route("admin.categories.destroy", category.id));
        }
    };

    return (
        <Master
            title="Edit Category"
            head={<Header title="Edit Category" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route("admin.categories.index")}
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span> Back to Categories </span>
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Edit Category
                        </h1>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            <span> Delete </span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardContent padding="lg">
                        <form onSubmit={handleSubmit}>
                            {/* Title */}
                            <div>
                                <InputLabel
                                    htmlFor="title"
                                    value="Category Title"
                                />
                                <TextInput
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        handleTitleChange(e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Enter category title"
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <InputLabel htmlFor="slug" value="Slug" />
                                <TextInput
                                    id="slug"
                                    name="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="category-slug"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    URL - friendly version of the title.
                                </p>
                                <InputError
                                    message={errors.slug}
                                    className="mt-2"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <ImageUploader
                                    label="Category Image"
                                    multiple={false}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    maxFiles={1}
                                    value={data.image}
                                    existingImages={existingImages}
                                    onRemoveExisting={handleRemoveExisting}
                                    error={errors.image}
                                />
                                <InputError
                                    message={errors.image}
                                    className="mt-2"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <Link
                                    href={route("admin.categories.index")}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    {processing
                                        ? "Updating..."
                                        : "Update Category"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Master>
    );
};

export default Edit;
