import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head } from "@inertiajs/react";

export default function Index() {
    return (
        <Master
            title= "Marketing"
    head = {< Header title = "Marketing" showUserMenu = { true} />}
        >
    <Head title="Marketing" />
        <div className="p-6" >
            <div className="bg-[#0E1614] rounded-lg p-6 border border-gray-800" >
                <h1 className="text-2xl font-bold mb-4 text-[#2DE3A7]" > Marketing </h1>
                    < p className = "text-gray-400" > This module is under construction.</p>
                        </div>
                        </div>
                        </Master>
    );
}
