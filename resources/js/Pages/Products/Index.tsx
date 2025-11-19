import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Header from "@/Components/Layouts/Header";
import Search from "@/Components/Ui/Search";
import Master from "@/Layouts/Master";
import { Plus, BookOpen, Store, Settings, PenLine } from "lucide-react";
import { useState } from "react";

export default function Index() {
    const [searchTerm, setSearchTerm] = useState("");
    return (
        <Master
            title="Products"
            head={<Header title="Products" showUserMenu={true} />}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <PrimaryButton as="link" href="/dashboard">
                        <Plus size={18} />
                        <span>Add New</span>
                    </PrimaryButton>

                    <button className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition">
                        <BookOpen size={18} />
                    </button>

                    <button className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition">
                        <Store size={18} />
                    </button>

                    <button className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition">
                        <Settings size={18} />
                    </button>

                    <button className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 transition">
                        <PenLine size={18} />
                    </button>
                </div>

                {/* Search Bar */}
                <Search
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={(value) => {
                        console.log("Searching for:", value);
                        // Your search logic here
                    }}
                    placeholder="Search users..."
                />
            </div>

            <h2 className="mb-4 text-xl font-bold">Products</h2>
            <p>List of products will be displayed here.</p>
        </Master>
    );
}
