import Head from "@/Components/Layouts/Head";
import Master from "@/Layouts/Master";

export default function Dashboard() {
    return (
        <Master head={<Head title="Dashboard" showUserMenu={true} />}>
            <div className="text-white">Your dashboard content</div>
        </Master>
    );
}
