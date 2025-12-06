import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Card, { CardContent } from "@/Components/Ui/Card";

interface Props {
    credentials: {
        pathao_user?: string;
        pathao_password?: string;
        steadfast_user?: string;
        steadfast_password?: string;
        redx_phone?: string;
        redx_password?: string;
    };
}

export default function Index({ credentials }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        pathao_user: credentials.pathao_user || "",
        pathao_password: credentials.pathao_password || "",
        steadfast_user: credentials.steadfast_user || "",
        steadfast_password: credentials.steadfast_password || "",
        redx_phone: credentials.redx_phone || "",
        redx_password: credentials.redx_password || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.courier.update"));
    };

    return (
        <Master
            title="Courier Settings"
            head={<Header title="Courier Settings" showUserMenu={true} />}
        >
            <Head title="Courier Settings" />
            <div className="p-6 max-w-8xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* Pathao */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-[#2DE3A7] border-b border-gray-800 pb-2 mb-4">
                                Pathao Courier
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="pathao_user"
                                        value="Pathao User / Email"
                                    />
                                    <TextInput
                                        id="pathao_user"
                                        name="pathao_user"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.pathao_user}
                                        onChange={(e) =>
                                            setData(
                                                "pathao_user",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="pathao_password"
                                        value="Pathao Password"
                                    />
                                    <TextInput
                                        id="pathao_password"
                                        name="pathao_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.pathao_password}
                                        onChange={(e) =>
                                            setData(
                                                "pathao_password",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Steadfast */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-[#2DE3A7] border-b border-gray-800 pb-2 mb-4">
                                Steadfast Courier
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="steadfast_user"
                                        value="Steadfast User / Email"
                                    />
                                    <TextInput
                                        id="steadfast_user"
                                        name="steadfast_user"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.steadfast_user}
                                        onChange={(e) =>
                                            setData(
                                                "steadfast_user",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="steadfast_password"
                                        value="Steadfast Password"
                                    />
                                    <TextInput
                                        id="steadfast_password"
                                        name="steadfast_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.steadfast_password}
                                        onChange={(e) =>
                                            setData(
                                                "steadfast_password",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RedX */}
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-[#2DE3A7] border-b border-gray-800 pb-2 mb-4">
                                RedX Courier
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="redx_phone"
                                        value="RedX Phone"
                                    />
                                    <TextInput
                                        id="redx_phone"
                                        name="redx_phone"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.redx_phone}
                                        onChange={(e) =>
                                            setData(
                                                "redx_phone",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="redx_password"
                                        value="RedX Password"
                                    />
                                    <TextInput
                                        id="redx_password"
                                        name="redx_password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.redx_password}
                                        onChange={(e) =>
                                            setData(
                                                "redx_password",
                                                e.target.value
                                            )
                                        }
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
