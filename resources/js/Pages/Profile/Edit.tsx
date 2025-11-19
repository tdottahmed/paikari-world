import { PageProps } from "@/types";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <Master
            title="Profile"
            head={
                <Header
                    title="Profile"
                    subtitle="You can update your profile information and email address here."
                    showUserMenu={true}
                />
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-xxl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xxl"
                        />
                    </div>

                    <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg">
                        <UpdatePasswordForm className="max-w-xxl" />
                    </div>

                    <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg">
                        <DeleteUserForm className="max-w-xxl" />
                    </div>
                </div>
            </div>
        </Master>
    );
}
