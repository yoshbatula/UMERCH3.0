import React from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import { useStockOut } from "./InventoryFunction/StockOutFunctions";

/* ✅ ICONS */
import TotalStocks from "@images/TotalStocks.svg";
import LowStocks from "@images/LowStocks.svg";
import OutOfStocks from "@images/OutOfStocks.svg";
import SearchIcon from "@images/SearchIcon.svg";

/* ===============================
Stat Card (SAME SIZE & STYLE)
================================ */
const StatCard = ({ title, value, bg, icon }) => (
    <div
        className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${bg}`}
    >
        <div>
            <p className="text-lg opacity-90">{title}</p>
            <p className="text-4xl font-bold mt-1">{value}</p>
        </div>

        {/* BIG ICON – no background */}
        <img
            src={icon}
            alt={title}
            className="w-16 h-16"   // 👈 icon size (≈ 2xl)
        />
    </div>
);

export default function StockOut() {
    const { logs, stocks, fetchStocks, fetchLogs, } = useStockOut();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <div className="flex-1 px-10 py-10">
                {/* Header */}
                <h1 className="text-4xl font-extrabold tracking-[0.25em] mb-1">
                    INVENTORY
                </h1>
                <p className="text-gray-500 mb-6">
                    Welcome back Admin, everything looks great.
                </p>

                {/* ✅ Stat Cards */}
                <div className="flex gap-6 mb-10 flex-wrap">
                    <StatCard
                        title="Total Stocks"
                        value={stocks.length}
                        bg="bg-[#5C975A]"
                        icon={TotalStocks}
                    />
                    <StatCard
                        title="Low Stocks"
                        value={stocks.filter(s => s.product_stock > 0 && s.product_stock <= 20).length}
                        bg="bg-[#F7962A]"
                        icon={LowStocks}
                    />
                    <StatCard
                        title="Out of Stocks"
                        value={stocks.filter(s => s.product_stock === 0).length}
                        bg="bg-[#EF2F2A]"
                        icon={OutOfStocks}
                    />
                </div>

                {/* Stock Out Logs */}
                <h2 className="text-2xl font-bold mb-4">Stock Out</h2>

                {/* Search */}
                <div className="mt-4 mb-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 flex-1 max-w-[520px] h-12 bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <img src={SearchIcon} alt="Search" className="w-5 h-5" />

                        <input
                            type="text"
                            placeholder="Search Product Name"
                            className="bg-transparent outline-none w-full text-sm"
                        />
                    </div>
                </div>
                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 px-8 py-4 text-sm font-bold text-red-700 border-b gap-4">
                        <div className="col-span-2">Date / Time</div>
                        <div className="col-span-3">Product</div>
                        <div className="col-span-2">Variant</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-3">Modifier</div>
                    </div>

                    <div className="min-h-[420px]">
                        {logs.length === 0 ? (
                            <div className="text-center py-24 text-gray-400">
                                No stock-out records found
                            </div>
                        ) : (
                            logs.map(log => (
                                <div
                                    key={log.id}
                                    className="grid grid-cols-12 px-8 py-4 border-b text-sm gap-4"
                                >
                                    <div className="col-span-2">{log.date_time}</div>
                                    <div className="col-span-3">{log.product_name}</div>
                                    <div className="col-span-2">{log.variant || '-'}</div>
                                    <div className="col-span-2">{log.quantity}</div>
                                    <div className="col-span-3">{log.modified_by}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <AdminFooter />
            </div>
        </div>
    );
}
