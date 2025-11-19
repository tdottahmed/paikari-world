import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";

export default function Index() {
    return (
        <Master
            title="Settings"
            head={<Header title="Settings" showUserMenu={true} />}
        >
            <div className="text-white">Your settings content</div>
            <div className="text-white">Your settings content</div>
        </Master>
    );
}
