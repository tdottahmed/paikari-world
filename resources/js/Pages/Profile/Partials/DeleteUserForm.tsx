import DangerButton from "@/Components/Actions/DangerButton";
import SecondaryButton from "@/Components/Actions/SecondaryButton";
import InputError from "@/Components/Ui/InputError";
import InputLabel from "@/Components/Ui/InputLabel";
import Modal from "@/Components/Ui/Modal";
import TextInput from "@/Components/Ui/TextInput";
import Card, {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/Components/Ui/Card";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

export default function DeleteUserForm({
    className = "",
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <Card>
                <CardHeader>
                    <CardTitle>Delete Account</CardTitle>
                    <CardDescription>
                        Once your account is deleted, all of its resources and
                        data will be permanently deleted. Before deleting your
                        account, please download any data or information that
                        you wish to retain.
                    </CardDescription>
                </CardHeader>

                <CardContent padding="lg">
                    <DangerButton onClick={confirmUserDeletion}>
                        Delete Account
                    </DangerButton>
                </CardContent>
            </Card>

            {/* Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <CardHeader withBorder={false} className="pb-4">
                        <CardTitle as="h2">
                            Are you sure you want to delete your account?
                        </CardTitle>
                        <CardDescription>
                            Once your account is deleted, all of its resources
                            and data will be permanently deleted. Please enter
                            your password to confirm you would like to
                            permanently delete your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent padding="none" className="mt-4">
                        <div>
                            <InputLabel
                                htmlFor="password"
                                value="Password"
                                className="sr-only"
                            />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full"
                                isFocused
                                placeholder="Enter your password"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>
                    </CardContent>

                    <CardFooter
                        withBorder={false}
                        className="mt-6 flex justify-end space-x-3"
                    >
                        <SecondaryButton onClick={closeModal} type="button">
                            Cancel
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            {processing ? "Deleting..." : "Delete Account"}
                        </DangerButton>
                    </CardFooter>
                </form>
            </Modal>
        </section>
    );
}
