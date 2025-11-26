import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import Card from "@/Components/Ui/Card";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import { FormEventHandler } from "react";

interface Props {
    settings: {
        yuan_rate: string;
        additional_cost: string;
        profit: string;
    };
}

export default function Index({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        yuan_rate: settings.yuan_rate || "",
        additional_cost: settings.additional_cost || "",
        profit: settings.profit || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.price-calculator.update"));
    };

    return (
        <Master
            title="Price Calculator"
            head={<Header title="Price Calculator" showUserMenu={true} />}
        >
            <Head title="Price Calculator" />
            <div className="p-2">
                <Card className="max-w-8xl mx-auto">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="yuan_rate"
                                value="Yuan Rate"
                                required
                            />
                            <TextInput
                                id="yuan_rate"
                                name="yuan_rate"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.yuan_rate}
                                onChange={(e) =>
                                    setData("yuan_rate", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.yuan_rate}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="additional_cost"
                                value="Additional Cost"
                                required
                            />
                            <TextInput
                                id="additional_cost"
                                name="additional_cost"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.additional_cost}
                                onChange={(e) =>
                                    setData("additional_cost", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.additional_cost}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="profit"
                                value="Profit"
                                required
                            />
                            <TextInput
                                id="profit"
                                name="profit"
                                type="number"
                                className="mt-1 block w-full"
                                value={data.profit}
                                onChange={(e) =>
                                    setData("profit", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.profit}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <PrimaryButton
                                className="w-full justify-center"
                                disabled={processing}
                            >
                                Save
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </Master>
    );
}
