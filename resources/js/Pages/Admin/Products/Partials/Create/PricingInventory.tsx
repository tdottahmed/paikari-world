import React, { useEffect, useState } from "react";
import { calculateProfit } from "@/Utils/helpers";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import { PlusIcon, Trash2Icon, Box } from "lucide-react";

interface QtyPrice {
    id: string;
    qty: string;
    qty_price: string;
}

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    settings: {
        yuan_rate: string;
        additional_cost: string;
        profit: string;
    };
}

export default function PricingInventory({
    data,
    setData,
    errors,
    settings,
}: Props) {
    const [profit, setProfit] = useState<number | null>(null);

    // Calculate UAN Price from Purchase Price
    const calculateUanFromPurchase = (purchasePrice: number) => {
        const rate = parseFloat(settings.yuan_rate) || 0;
        const additional = parseFloat(settings.additional_cost) || 0;
        if (rate > 0) {
            return ((purchasePrice - additional) / rate).toFixed(2);
        }
        return "0.00";
    };

    // Calculate Purchase Price from UAN Price
    const calculatePurchaseFromUan = (uanPrice: number) => {
        const rate = parseFloat(settings.yuan_rate) || 0;
        return (uanPrice * rate).toFixed(2);
    };

    // Calculate Sale Price based on Purchase Price and Profit %
    const calculateSaleFromPurchase = (purchasePrice: number) => {
        const profitMargin = parseFloat(settings.profit) || 0;
        const additional = parseFloat(settings.additional_cost) || 0;
        return (purchasePrice + profitMargin + additional).toFixed(2);
    };

    // Effect to update profit display when prices change
    useEffect(() => {
        const purchase = parseFloat(data.purchase_price) || 0;
        const sale = parseFloat(data.sale_price) || 0;
        const additional = parseFloat(settings.additional_cost) || 0;

        if (purchase > 0 && sale > 0) {
            setProfit(calculateProfit(sale, purchase, additional));
        } else {
            setProfit(null);
        }
    }, [data.purchase_price, data.sale_price, settings.additional_cost]);

    const handlePurchasePriceChange = (val: string) => {
        const purchase = parseFloat(val);
        if (!isNaN(purchase)) {
            // Auto-calculate UAN Price
            const uan = calculateUanFromPurchase(purchase);
            // Auto-calculate Sale Price
            const sale = calculateSaleFromPurchase(purchase);

            (setData as any)((previousData: any) => ({
                ...previousData,
                purchase_price: val,
                uan_price: uan,
                sale_price: sale,
            }));
        } else {
            (setData as any)((previousData: any) => ({
                ...previousData,
                purchase_price: val,
                uan_price: "",
                sale_price: "",
            }));
        }
    };

    const handleUanPriceChange = (val: string) => {
        const uan = parseFloat(val);
        if (!isNaN(uan)) {
            const purchase = calculatePurchaseFromUan(uan);
            const sale = calculateSaleFromPurchase(parseFloat(purchase));

            (setData as any)((previousData: any) => ({
                ...previousData,
                uan_price: val,
                purchase_price: purchase,
                sale_price: sale,
            }));
        } else {
            (setData as any)((previousData: any) => ({
                ...previousData,
                uan_price: val,
                purchase_price: "",
                sale_price: "",
            }));
        }
    };

    const addQtyPrice = () => {
        const newQtyPrice: QtyPrice = {
            id: Date.now().toString(),
            qty: "",
            qty_price: "",
        };
        setData("qty_prices", [...data.qty_prices, newQtyPrice]);
    };

    const removeQtyPrice = (id: string) => {
        setData(
            "qty_prices",
            data.qty_prices.filter((item: QtyPrice) => item.id !== id),
        );
    };

    const updateQtyPrice = (
        id: string,
        field: keyof QtyPrice,
        value: string,
    ) => {
        const updated = data.qty_prices.map((item: QtyPrice) =>
            item.id === id ? { ...item, [field]: value } : item,
        );
        setData("qty_prices", updated);
    };

    return (
        <div className="lg:p-6 sm:p-2 space-y-4">
            {/* Pricing Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Product Pricing </span>
                        {profit !== null && (
                            <div
                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                    profit >= 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                Profit: {profit.toFixed(2)}
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent padding="lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <InputLabel
                                htmlFor="uan_price"
                                value="UAN(¥) Price"
                                required
                            />
                            <TextInput
                                id="uan_price"
                                name="uan_price"
                                type="number"
                                step="0.01"
                                value={data.uan_price}
                                onChange={(e) =>
                                    handleUanPriceChange(e.target.value)
                                }
                                placeholder="0.00"
                                required
                            />
                            <InputError message={errors.uan_price} />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="purchase_price"
                                value="Buy Price (BDT)"
                                required
                            />
                            <TextInput
                                id="purchase_price"
                                name="purchase_price"
                                type="number"
                                step="0.01"
                                value={data.purchase_price}
                                onChange={(e) =>
                                    handlePurchasePriceChange(e.target.value)
                                }
                                placeholder="0.00"
                            />
                            <InputError message={errors.purchase_price} />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="sale_price"
                                value="Sale Price (BDT)"
                                required
                            />
                            <div className="relative">
                                <TextInput
                                    id="sale_price"
                                    name="sale_price"
                                    type="number"
                                    step="0.01"
                                    value={data.sale_price}
                                    onChange={(e) =>
                                        setData("sale_price", e.target.value)
                                    }
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <InputError message={errors.sale_price} />
                        </div>
                    </div>

                    {/* Qty Price Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <InputLabel value="Qty Price" />
                            <PrimaryButton
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addQtyPrice}
                            >
                                <PlusIcon size={16} className="mr-1" /> Add Qty
                                Price
                            </PrimaryButton>
                        </div>

                        {data.qty_prices.map(
                            (qtyPrice: QtyPrice, index: number) => (
                                <Card
                                    key={qtyPrice.id}
                                    className="mb-4 relative"
                                >
                                    <CardContent className="pt-6">
                                        <div className="absolute top-3 right-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeQtyPrice(qtyPrice.id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2Icon size={18} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor={`qty-${qtyPrice.id}`}
                                                    value="Quantity"
                                                    required
                                                />
                                                <TextInput
                                                    id={`qty-${qtyPrice.id}`}
                                                    name={`qty_prices[${index}][qty]`}
                                                    type="number"
                                                    value={qtyPrice.qty}
                                                    onChange={(e) =>
                                                        updateQtyPrice(
                                                            qtyPrice.id,
                                                            "qty",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <InputLabel
                                                    htmlFor={`qty_price-${qtyPrice.id}`}
                                                    value="Qty Price"
                                                    required
                                                />
                                                <TextInput
                                                    id={`qty_price-${qtyPrice.id}`}
                                                    name={`qty_prices[${index}][qty_price]`}
                                                    type="number"
                                                    value={qtyPrice.qty_price}
                                                    onChange={(e) =>
                                                        updateQtyPrice(
                                                            qtyPrice.id,
                                                            "qty_price",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ),
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stock Card */}
            <Card>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-white">
                        {" "}
                        Stock{" "}
                    </span>
                    <Box className="text-[#2DE3A7]" size={20} />
                </div>
                <CardContent>
                    <TextInput
                        id="stock"
                        name="stock"
                        type="number"
                        value={data.stock}
                        onChange={(e) => setData("stock", e.target.value)}
                        placeholder="0"
                    />
                    <InputError message={errors.stock} />

                    <div className="flex items-center mt-4">
                        <input
                            id="is_preorder"
                            name="is_preorder"
                            type="checkbox"
                            checked={data.is_preorder}
                            onChange={(e) =>
                                setData("is_preorder", e.target.checked)
                            }
                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label
                            htmlFor="is_preorder"
                            className="ml-2 text-sm font-medium text-gray-300"
                        >
                            Is Preorder Product ?
                        </label>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
