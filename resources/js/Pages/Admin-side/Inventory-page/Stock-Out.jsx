import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import axios from "axios";

/* ✅ ICONS */
import TotalStocks from "@images/TotalStocks.svg";
import LowStocks from "@images/LowStocks.svg";
import OutOfStocks from "@images/OutOfStocks.svg";

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
            className="w-12 h-12"   // 👈 icon size (≈ 2xl)
        />
    </div>
);

export default function StockOut() {
    const [logs, setLogs] = useState([]);
    const [stocks, setStocks] = useState([]);

    const STOCK_API = "/api/admin/stock-in";       // for StatCards
    const LOG_API = "/api/admin/stock-out/logs";   // for table

    useEffect(() => {
        fetchStocks();
        fetchLogs();
    }, []);

    const fetchStocks = async () => {
        try {
            const res = await axios.get(STOCK_API);
            setStocks(res.data);
        } catch (err) {
            console.error("Failed to fetch stocks", err);
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await axios.get(LOG_API);
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to fetch stock-out logs", err);
        }
    };

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
                        value={stocks.filter(s => s.stock_qty > 0 && s.stock_qty <= 20).length}
                        bg="bg-[#F7962A]"
                        icon={LowStocks}
                    />
                    <StatCard
                        title="Out of Stocks"
                        value={stocks.filter(s => s.stock_qty === 0).length}
                        bg="bg-[#EF2F2A]"
                        icon={OutOfStocks}
                    />
                </div>

                {/* Stock Out Logs */}
                <h2 className="text-2xl font-bold mb-4">Stock Out</h2>

                {/* Search */}
                <div className="mt-4 mb-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3 flex-1 max-w-[520px] h-12 bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"> <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                            <path
                                d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search transactions"
                            className="bg-transparent outline-none w-full text-sm"
                        />
                    </div>
                </div>
                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 px-8 py-4 text-sm font-bold text-red-700 border-b gap-4">
                        <div className="col-span-3">Date / Time</div>
                        <div className="col-span-4">Product</div>
                        <div className="col-span-3">Quantity</div>
                        <div className="col-span-2">Modifier</div>
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
                                    <div className="col-span-3">{log.date_time}</div>
                                    <div className="col-span-4">{log.product_name}</div>
                                    <div className="col-span-3">{log.quantity}</div>
                                    <div className="col-span-2">{log.modified_by}</div>
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
