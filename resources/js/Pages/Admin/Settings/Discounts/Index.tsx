import { useForm, Head } from "@inertiajs/react";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import { Plus, Trash2, Save } from "lucide-react";

interface Discount {
    qty: string;
    discount: string;
}

interface Props {
    discounts: Discount[];
}

export default function Index({ discounts }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        discounts:
            discounts.length > 0 ? discounts : [{ qty: "", discount: "" }],
    });

    const addDiscount = () => {
        setData("discounts", [...data.discounts, { qty: "", discount: "" }]);
    };

    const removeDiscount = (index: number) => {
        const newDiscounts = data.discounts.filter((_, i) => i !== index);
        setData("discounts", newDiscounts);
    };

    const updateDiscount = (
        index: number,
        field: keyof Discount,
        value: string
    ) => {
        const newDiscounts = data.discounts.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData("discounts", newDiscounts);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.discounts.update"));
    };

    return (
        <Master
            title="Discounts"
            head={<Header title="Discounts" showUserMenu={true} />}
        >
            <Head title="Discounts" />
            <div className="p-6">
                <div className="bg-[#0E1614] rounded-lg p-6 border border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-[#2DE3A7]">
                            Quantity Based Discounts
                        </h1>
                        <PrimaryButton
                            type="button"
                            onClick={addDiscount}
                            className="bg-[#2DE3A7] hover:bg-[#25c28e] text-black"
                        >
                            <Plus size={18} className="mr-2" /> Add Discount
                        </PrimaryButton>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 mb-2 text-gray-400 text-sm font-medium px-2">
                            <div className="col-span-1"># </div>
                            <div className="col-span-5"> Minimum Quantity </div>
                            <div className="col-span-5">
                                {" "}
                                Discount Amount(Tk){" "}
                            </div>
                            <div className="col-span-1 text-right">
                                {" "}
                                Action{" "}
                            </div>
                        </div>

                        {data.discounts.map((discount, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-4 items-start mb-4 p-2 rounded-md"
                            >
                                <div className="col-span-1 flex items-center h-[42px] text-gray-500">
                                    {index + 1}
                                </div>
                                <div className="col-span-5">
                                    <TextInput
                                        id="qty"
                                        type="number"
                                        name="qty"
                                        value={discount.qty}
                                        onChange={(e) =>
                                            updateDiscount(
                                                index,
                                                "qty",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 12"
                                        className="w-full bg-gray-800 text-white border-gray-700 focus:border-[#2DE3A7]"
                                    />
                                </div>
                                <div className="col-span-5">
                                    <TextInput
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        value={discount.discount}
                                        onChange={(e) =>
                                            updateDiscount(
                                                index,
                                                "discount",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 5"
                                        className="w-full bg-gray-800 text-white border-gray-700 focus:border-[#2DE3A7]"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeDiscount(index)}
                                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-4">
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="bg-[#2DE3A7] hover:bg-[#25c28e] text-black px-8"
                            >
                                <Save size={18} className="mr-2" />
                                {processing ? "Saving..." : "Save Changes"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Master>
    );
}
