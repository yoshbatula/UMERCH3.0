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
                        bg="bg-green-700"
                        icon={TotalStocks}
                    />
                    <StatCard
                        title="Low Stocks"
                        value={stocks.filter(s => s.stock_qty > 0 && s.stock_qty <= 20).length}
                        bg="bg-orange-500"
                        icon={LowStocks}
                    />
                    <StatCard
                        title="Out of Stocks"
                        value={stocks.filter(s => s.stock_qty === 0).length}
                        bg="bg-red-600"
                        icon={OutOfStocks}
                    />
                </div>

                {/* Stock Out Logs */}
                <h2 className="text-2xl font-bold mb-4">Stock Out</h2>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search transactions"
                    className="w-[520px] px-4 py-2 mb-4 rounded-lg border border-gray-200 bg-white text-sm outline-none"
                />

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
