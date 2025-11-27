import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import TextInput from "@/Components/Ui/TextInput";
import { formatPrice } from "@/Utils/helpers";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface DashboardProps {
    metrics: {
        total_sell: number;
        profit: number;
        completed_sell: number;
        completed_profit: number;
        extra_costs: number;
        total_orders: number;
        completed_orders: number;
        canceled_orders: number;
        total_items: number;
        unique_items: number;
        total_quantity: number;
        free_delivery: number;
    };
    charts: {
        sales_trend: { date: string; sales: number }[];
        order_status: { name: string; value: number }[];
    };
    filters: {
        date_range: string;
        start_date: string | null;
        end_date: string | null;
    };
}

const MetricCard = ({
    title,
    value,
    subValue,
}: {
    title: string | number;
    value: string | number;
    subValue?: string;
}) => (
    <div className="bg-[#0b1818] border border-[#1a2c2c] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-40">
        <div className="text-3xl font-bold text-white mb-2"> {value} </div>
        <div className="text-gray-400 text-sm"> {title} </div>
        {subValue && (
            <div className="text-gray-500 text-xs mt-1"> {subValue} </div>
        )}
    </div>
);

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
];

export default function Dashboard({
    metrics,
    charts,
    filters,
}: DashboardProps) {
    const [dateRange, setDateRange] = useState(filters?.date_range || "all");
    const [startDate, setStartDate] = useState(filters?.start_date || "");
    const [endDate, setEndDate] = useState(filters?.end_date || "");
    const [showCustomDate, setShowCustomDate] = useState(
        filters?.date_range === "custom"
    );

    const handleFilterChange = (range: string) => {
        setDateRange(range);
        if (range === "custom") {
            setShowCustomDate(true);
        } else {
            setShowCustomDate(false);
            router.get(
                route("admin.dashboard"),
                { date_range: range },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const applyCustomFilter = () => {
        if (startDate && endDate) {
            router.get(
                route("admin.dashboard"),
                {
                    date_range: "custom",
                    start_date: startDate,
                    end_date: endDate,
                },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    return (
        <Master
            title="Dashboard"
            head={<Header title="Dashboard" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="bg-[#0b1818] border border-[#1a2c2c] text-white text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                        >
                            <option value="today"> Today </option>
                            <option value="yesterday"> Last day </option>
                            <option value="last_week"> Last one week </option>
                            <option value="last_month"> Last Month </option>
                            <option value="last_6_months">
                                {" "}
                                last 6 month{" "}
                            </option>
                            <option value="last_year"> Last 1 year </option>
                            <option value="all"> all </option>
                            <option value="custom"> Custom Range </option>
                        </select>
                    </div>

                    {showCustomDate && (
                        <div className="flex items-center gap-2">
                            <TextInput
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-[#0b1818] border border-[#1a2c2c] text-white text-sm rounded-lg p-2.5"
                            />
                            <span className="text-gray-400"> to </span>
                            <TextInput
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-[#0b1818] border border-[#1a2c2c] text-white text-sm rounded-lg p-2.5"
                            />
                            <button
                                onClick={applyCustomFilter}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm px-4 py-2.5"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard
                        title="Total Sell"
                        value={formatPrice(metrics.total_sell)}
                    />
                    <MetricCard
                        title="Profit"
                        value={formatPrice(metrics.profit)}
                    />
                    <MetricCard
                        title="Completed Sell"
                        value={formatPrice(metrics.completed_sell)}
                    />

                    <MetricCard
                        title="Completed Profit"
                        value={formatPrice(metrics.completed_profit)}
                    />
                    <MetricCard
                        title="Extra Costs"
                        value={formatPrice(metrics.extra_costs)}
                    />
                    <MetricCard
                        title="Total Orders"
                        value={metrics.total_orders}
                    />

                    <MetricCard
                        title="Completed Orders"
                        value={metrics.completed_orders}
                    />
                    <MetricCard
                        title="Canceled Orders"
                        value={metrics.canceled_orders}
                    />
                    <MetricCard
                        title="Total items"
                        value={metrics.total_items.toLocaleString()}
                    />

                    <MetricCard
                        title="Unique items"
                        value={metrics.unique_items}
                    />
                    <MetricCard
                        title="Total quantity"
                        value={metrics.total_quantity.toLocaleString()}
                    />
                    <MetricCard
                        title="Free delivery"
                        value={metrics.free_delivery}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sales Trend Chart */}
                    <div className="bg-[#0b1818] border border-[#1a2c2c] rounded-2xl p-4 md:p-6">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            {" "}
                            Sales Trend{" "}
                        </h3>
                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={charts.sales_trend}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorSales"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10B981"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10B981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#1f2937"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#9ca3af"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) =>
                                            value.split("-").slice(1).join("/")
                                        }
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        tick={{ fontSize: 12 }}
                                        tickFormatter={(value) =>
                                            `${value / 1000}k`
                                        }
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#111827",
                                            borderColor: "#374151",
                                            color: "#fff",
                                            fontSize: "12px",
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Chart */}
                    <div className="bg-[#0b1818] border border-[#1a2c2c] rounded-2xl p-4 md:p-6">
                        <h3 className="text-white text-lg font-semibold mb-4">
                            {" "}
                            Order Status Distribution{" "}
                        </h3>
                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.order_status}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${(percent
                                                ? percent * 100
                                                : 0
                                            ).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {charts.order_status.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#111827",
                                            borderColor: "#374151",
                                            color: "#fff",
                                            fontSize: "12px",
                                        }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            fontSize: "12px",
                                            paddingTop: "10px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
