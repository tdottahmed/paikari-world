import React, { useState, FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Upload, X, Trash2 } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import { Category } from "@/types";

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

    const [imagePreview, setImagePreview] = useState<string | null>(
        category.image ? `/storage/${category.image}` : null
    );
    const [deleting, setDeleting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData("image", null);
        setImagePreview(category.image ? `/storage/${category.image}` : null);
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
            <div className="p-4 md:p-6 max-w-3xl mx-auto">
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
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6"
                >
                    {/* Title */}
                    <div>
                        <InputLabel htmlFor="title" value="Category Title" />
                        <TextInput
                            id="title"
                            name="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Enter category title"
                            required
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    {/* Slug */}
                    <div>
                        <InputLabel htmlFor="slug" value="Slug" />
                        <TextInput
                            id="slug"
                            name="slug"
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="category-slug"
                            required
                        />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            URL - friendly version of the title.
                        </p>
                        <InputError message={errors.slug} className="mt-2" />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <InputLabel
                            htmlFor="image"
                            value="Category Image (Optional)"
                        />
                        {imagePreview ? (
                            <div className="mt-2 relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label
                                htmlFor="image"
                                className="mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload
                                        size={40}
                                        className="mb-3 text-gray-400"
                                    />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF, WEBP(MAX. 2MB)
                                    </p>
                                </div>
                                <input
                                    id="image"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                        <InputError message={errors.image} className="mt-2" />
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
                            {processing ? "Updating..." : "Update Category"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Master>
    );
};

export default Edit;
