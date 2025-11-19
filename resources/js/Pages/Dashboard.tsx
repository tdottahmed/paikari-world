import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";

export default function Dashboard() {
    return (
        <Master
            title="Dashboard"
            head={<Header title="Dashboard" showUserMenu={true} />}
        >
            <div className="text-white">Your dashboard content</div>
        </Master>
    );
}
