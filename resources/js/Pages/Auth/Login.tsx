import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Checkbox from "@/Components/Ui/Checkbox";
import InputError from "@/Components/Ui/InputError";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import BrandLogo from "@/Components/Utility/BrandLogo";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="text-center mb-8">
                <BrandLogo
                    size="lg"
                    withText={true}
                    className="justify-center mb-4"
                />
                <p className="text-gray-400 text-sm">
                    Sign in to your dashboard
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter your email"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="text-sm text-gray-300 hover:text-white transition-colors">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-[#2DE3A7] hover:text-[#22c996] transition-colors underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-4">
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-[#0C1311] border-t-transparent rounded-full animate-spin"></div>
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            "Sign in"
                        )}
                    </PrimaryButton>
                </div>
            </form>

            {/* Additional Links */}
            <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="text-[#2DE3A7] hover:text-[#22c996] font-medium transition-colors"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
