import { formatPrice } from "@/Utils/helpers";

interface HeaderStatsProps {
    total: number;
    checkouts: number;
    stock: number;
    buy_value: number;
    sell_value: number;
    profit: number;
}

export default function HeaderStats({ stats }: { stats: HeaderStatsProps }) {
    return (
        <div>
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {/* Items */}
                <div className="bg-gray-900/50 p-2 rounded-l text-center border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm font-medium mb-1">
                            {" "}
                            Items{" "}
                        </span>
                        <span className="text-l font-bold text-emerald-400">
                            {" "}
                            {stats.total}{" "}
                        </span>
                    </div>
                </div>

                {/* Checkouts */}
                <div className="bg-gray-900/50 p-2 rounded-l text-center border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm font-medium mb-1">
                            {" "}
                            Checkouts{" "}
                        </span>
                        <span className="text-l font-bold text-emerald-400">
                            {" "}
                            {stats.checkouts}{" "}
                        </span>
                    </div>
                </div>

                {/* Stock */}
                <div className="bg-gray-900/50 p-2 rounded-l text-center border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm font-medium mb-1">
                            {" "}
                            Stock{" "}
                        </span>
                        <span className="text-l font-bold text-emerald-400">
                            {" "}
                            {stats.stock}{" "}
                        </span>
                    </div>
                </div>

                {/* Buy */}
                <div className="bg-gray-900/50 p-2 rounded-l text-center border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm font-medium mb-1">
                            {" "}
                            Buy{" "}
                        </span>
                        <span className="text-l font-bold text-emerald-400">
                            {" "}
                            {formatPrice(stats.buy_value)}{" "}
                        </span>
                    </div>
                </div>

                {/* Sell */}
                <div className="bg-gray-900/50 p-2 rounded-l text-center border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm font-medium mb-1">
                            {" "}
                            Sell{" "}
                        </span>
                        <span className="text-l font-bold text-emerald-400">
                            {" "}
                            {formatPrice(stats.sell_value)}{" "}
                        </span>
                    </div>
                </div>

                {/* Profit */}
                <div className="bg-gray-900/50 p-2 rounded-l text-center border border-gray-800">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-sm font-medium mb-1">
                            {" "}
                            Profit{" "}
                        </span>
                        <span className="text-l font-bold text-emerald-400">
                            {" "}
                            {formatPrice(stats.profit)}{" "}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
