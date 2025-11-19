import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import BrandLogo from "@/Components/Utility/BrandLogo";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            {/* Brand Logo Section */}
            <div className="text-center mb-8">
                <BrandLogo
                    size="lg"
                    withText={true}
                    className="justify-center mb-4"
                />
                <p className="text-gray-400 text-sm">Reset your password</p>
            </div>

            {/* Instruction Text */}
            <div className="mb-6 text-sm text-gray-300 text-center bg-[#0F1A18] border border-[#1E2826] rounded-lg p-4">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {/* Status Message */}
            {status && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
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
                        placeholder="Enter your email address"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="pt-4">
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-[#0C1311] border-t-transparent rounded-full animate-spin"></div>
                                <span>Sending reset link...</span>
                            </div>
                        ) : (
                            "Send Password Reset Link"
                        )}
                    </PrimaryButton>
                </div>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
                <Link
                    href={route("login")}
                    className="text-[#2DE3A7] hover:text-[#22c996] text-sm font-medium transition-colors"
                >
                    ← Back to login
                </Link>
            </div>
        </GuestLayout>
    );
}
