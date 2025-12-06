import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Card, { CardContent } from "@/Components/Ui/Card";
import Checkbox from "@/Components/Ui/Checkbox";

interface Props {
    bkash: {
        enabled: boolean;
        app_key?: string;
        app_secret?: string;
        username?: string;
        password?: string;
        base_url?: string;
    };
}

export default function Index({ bkash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        bkash_enabled: bkash.enabled,
        bkash_app_key: bkash.app_key || "",
        bkash_app_secret: bkash.app_secret || "",
        bkash_username: bkash.username || "",
        bkash_password: bkash.password || "",
        bkash_base_url: bkash.base_url || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.payment-gateways.update"));
    };

    return (
        <Master
            title="Payment Gateways"
            head={<Header title="Payment Gateways" showUserMenu={true} />}
        >
            <Head title="Payment Gateways" />
            <div className="p-6 max-w-8xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* Bkash */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-4">
                                <h3 className="text-lg font-semibold text-[#e2136e]">
                                    bKash Payment Gateway
                                </h3>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        name="bkash_enabled"
                                        checked={data.bkash_enabled}
                                        onChange={() =>
                                            setData(
                                                "bkash_enabled",
                                                !data.bkash_enabled
                                            )
                                        }
                                    />
                                    <span className="text-sm text-gray-300">
                                        Enable bKash
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="bkash_app_key"
                                        value="App Key"
                                    />
                                    <TextInput
                                        id="bkash_app_key"
                                        name="bkash_app_key"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.bkash_app_key}
                                        onChange={(e) =>
                                            setData(
                                                "bkash_app_key",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="bkash_app_secret"
                                        value="App Secret"
                                    />
                                    <TextInput
                                        id="bkash_app_secret"
                                        name="bkash_app_secret"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.bkash_app_secret}
                                        onChange={(e) =>
                                            setData(
                                                "bkash_app_secret",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="bkash_username"
                                        value="Username"
                                    />
                                    <TextInput
                                        id="bkash_username"
                                        name="bkash_username"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.bkash_username}
                                        onChange={(e) =>
                                            setData(
                                                "bkash_username",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="bkash_password"
                                        value="Password"
                                    />
                                    <TextInput
                                        id="bkash_password"
                                        name="bkash_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.bkash_password}
                                        onChange={(e) =>
                                            setData(
                                                "bkash_password",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel
                                        htmlFor="bkash_base_url"
                                        value="Base URL (Sandbox/Production)"
                                    />
                                    <TextInput
                                        id="bkash_base_url"
                                        name="bkash_base_url"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.bkash_base_url}
                                        onChange={(e) =>
                                            setData(
                                                "bkash_base_url",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <PrimaryButton disabled={processing}>
                            Save Changes
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Master>
    );
}
