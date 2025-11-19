import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Link } from "@inertiajs/react";
import { Plus, BookOpen, Store, Settings, PenLine, Search } from "lucide-react";

export default function Index() {
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
                <div className="relative w-64">
                    <Search
                        className="absolute left-3 top-2.5 text-neutral-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-neutral-900 border border-neutral-700 text-neutral-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-neutral-500"
                    />
                </div>
            </div>

            <h2 className="mb-4 text-xl font-bold">Products</h2>
            <p>List of products will be displayed here.</p>
        </Master>
    );
}
