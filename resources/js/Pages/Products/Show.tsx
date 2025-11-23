import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import Master from "@/Layouts/Master";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { ShowPageProps } from "@/types";
import {
    EditIcon,
    ArrowLeftIcon,
    PackageIcon,
    DollarSignIcon,
} from "lucide-react";
import ImageGallery from "@/Components/Ui/ImageGallery";

export default function Show({ product }: ShowPageProps) {
    const formatCurrency = (amount: number) => {
        return (
            `$${amount?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}` || "N/A"
        );
    };

    const getCategoryName = () => {
        return product.category?.title || "N/A";
    };

    const getSupplierName = () => {
        return product.supplier?.name || "N/A";
    };

    const getAttributeName = (attributeId: number) => {
        return (
            product.variations?.find((v) => v.attribute_id === attributeId)
                ?.attribute?.name || attributeId.toString()
        );
    };

    return (
        <Master
            title={product.name}
            head={<Header title={product.name} showUserMenu={true} />}
        >
            <div className="lg:p-6 p-4">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {product.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Product Details & Information
                        </p>
                    </div>
                    <PrimaryButton
                        as="link"
                        href={route("admin.product.edit", product.id)}
                        className="w-full sm:w-auto"
                    >
                        <EditIcon size={16} className="mr-2" />
                        Edit Product
                    </PrimaryButton>
                </div>

                {/* Product Images */}
                {product.images && product.images.length > 0 && (
                    <div className="mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                            </CardHeader>
                            <CardContent padding="lg">
                                <ImageGallery
                                    images={product.images.map(
                                        (url, index) => ({
                                            id: index.toString(),
                                            url,
                                            alt: `${product.name} image ${
                                                index + 1
                                            }`,
                                        })
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* General Information */}
                        <CollapsibleSection
                            title="General Information"
                            defaultOpen={true}
                        >
                            <Card>
                                <CardContent padding="lg">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel
                                                    value="Product Name"
                                                    htmlFor="name"
                                                />
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    value="Category"
                                                    htmlFor="category"
                                                />
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {getCategoryName()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel
                                                    value="Supplier"
                                                    htmlFor="supplier"
                                                />
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {getSupplierName()}
                                                </p>
                                            </div>
                                            <div>
                                                <InputLabel
                                                    value="Stock"
                                                    htmlFor="stock"
                                                />
                                                <p className="text-gray-900 dark:text-white font-medium">
                                                    {product.stock}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel
                                                value="Description"
                                                htmlFor="description"
                                            />
                                            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                                {product.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CollapsibleSection>

                        {/* Pricing & Stock */}
                        <CollapsibleSection
                            title="Pricing Information"
                            defaultOpen={true}
                        >
                            <Card>
                                <CardContent padding="lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <InputLabel
                                                value="Purchase Price"
                                                htmlFor="purchase-price"
                                            />
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    product.purchase_price
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <DollarSignIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                            <InputLabel
                                                value="Sale Price"
                                                htmlFor="sale-price"
                                            />
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    product.sale_price
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <PackageIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                            <InputLabel
                                                value="Current Stock"
                                                htmlFor="stock"
                                            />
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {product.stock}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel
                                                value="MOQ Price"
                                                htmlFor="moq-price"
                                            />
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {product.moq_price
                                                    ? formatCurrency(
                                                          product.moq_price
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <InputLabel
                                                value="UAN Price"
                                                htmlFor="uan-price"
                                            />
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {product.uan_price
                                                    ? formatCurrency(
                                                          product.uan_price
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CollapsibleSection>

                        {/* Quantity Prices */}
                        {product.qty_prices &&
                            product.qty_prices.length > 0 && (
                                <CollapsibleSection
                                    title="Quantity Prices"
                                    defaultOpen={false}
                                >
                                    <Card>
                                        <CardContent padding="lg">
                                            <div className="space-y-3">
                                                {product.qty_prices.map(
                                                    (qtyPrice, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                        >
                                                            <span className="font-medium text-gray-900 dark:text-white">
                                                                {qtyPrice.qty}{" "}
                                                                units
                                                            </span>
                                                            <span className="font-bold text-green-600">
                                                                {formatCurrency(
                                                                    qtyPrice.price
                                                                )}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CollapsibleSection>
                            )}

                        {/* Variations */}
                        {product.variations &&
                            product.variations.length > 0 && (
                                <CollapsibleSection
                                    title="Product Variations"
                                    defaultOpen={false}
                                >
                                    <Card>
                                        <CardContent padding="lg">
                                            <div className="space-y-4">
                                                {product.variations.map(
                                                    (variation, index) => (
                                                        <div
                                                            key={variation.id}
                                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                                        >
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <InputLabel
                                                                        value="Attribute"
                                                                        htmlFor="variation-attribute"
                                                                    />
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {getAttributeName(
                                                                            variation.attribute_id
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <InputLabel
                                                                        value="Value"
                                                                        htmlFor="variation-value"
                                                                    />
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {
                                                                            variation.value
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <InputLabel
                                                                        value="Stock"
                                                                        htmlFor="stock"
                                                                    />
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {variation.stock ||
                                                                            "Inherited"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <InputLabel
                                                                        value="Price"
                                                                        htmlFor="price"
                                                                    />
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {variation.price
                                                                            ? formatCurrency(
                                                                                  variation.price
                                                                              )
                                                                            : "Inherited"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CollapsibleSection>
                            )}
                    </div>

                    {/* Sidebar - Quick Stats */}
                    <div className="space-y-6">
                        {/* Product Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent padding="lg">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Status
                                        </span>
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Created
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(
                                                product.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Last Updated
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            {new Date(
                                                product.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stock Alert */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock Information</CardTitle>
                            </CardHeader>
                            <CardContent padding="lg">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Current Stock
                                        </span>
                                        <span
                                            className={`text-lg font-bold ${
                                                product.stock <= 10
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Low Stock Threshold
                                        </span>
                                        <span className="text-gray-900 dark:text-white">
                                            10
                                        </span>
                                    </div>
                                    {product.stock <= 10 && (
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                                            ⚠️ Low stock alert
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent padding="lg">
                                <div className="space-y-3">
                                    <PrimaryButton
                                        as="link"
                                        href={route(
                                            "admin.product.edit",
                                            product.id
                                        )}
                                        className="w-full justify-center"
                                    >
                                        <EditIcon size={16} className="mr-2" />
                                        Edit Product
                                    </PrimaryButton>
                                    <PrimaryButton
                                        as="link"
                                        href={route("admin.products.index")}
                                        variant="outline"
                                        className="w-full justify-center"
                                    >
                                        <ArrowLeftIcon
                                            size={16}
                                            className="mr-2"
                                        />
                                        Back to Products
                                    </PrimaryButton>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Master>
    );
}
