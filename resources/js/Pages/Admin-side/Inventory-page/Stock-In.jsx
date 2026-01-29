import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import AddStock from "../../../components/modals/AddStocksModal";
import EditStock from "../../../components/modals/EditStocks";
import axios from "axios";

// ✅ Stat Card (SIZE UNCHANGED, ICON BIG)
const StatCard = ({ title, value, bg }) => (
    <div className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${bg}`}>
        <div>
            <p className="text-lg opacity-90">{title}</p>
            <p className="text-4xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl font-bold opacity-30">
            #
        </div>
    </div>
);

export default function StockIn() {
    const [stocks, setStocks] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);

    const API = "/api/admin/stock-in";

    const fetchStocks = () => {
        axios.get(API).then(res => setStocks(res.data));
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const getStatus = qty => {
        if (qty === 0) return { label: "Out of Stock", color: "text-red-600" };
        if (qty <= 20) return { label: "Low Stock", color: "text-orange-500" };
        return { label: "Active", color: "text-green-600" };
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <div className="flex-1 px-10 py-10">
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
                    />
                    <StatCard
                        title="Low Stocks"
                        value={stocks.filter(s => s.stock_qty > 0 && s.stock_qty <= 20).length}
                        bg="bg-orange-500"
                    />
                    <StatCard
                        title="Out of Stocks"
                        value={stocks.filter(s => s.stock_qty === 0).length}
                        bg="bg-red-600"
                    />
                </div>

                {/* Header */}
                <h2 className="text-2xl font-bold mb-4">Stock In</h2>

                <div className=" flex items-center justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search transactions"
                        className="w-[520px] h-12 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm  outline-none"
                    />

                    <button
                        onClick={() => setOpenAdd(true)}
                        className="bg-red-800 hover:bg-red-900 text-white px-8 py-2 rounded-full text-sm font-semibold"
                    >
                        Add Stock
                    </button>
                </div>

                {/* TABLE */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 px-8 py-4 text-sm font-bold text-red-700 border-b">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-2">Cost</div>
                        <div className="col-span-2">Stocks</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>

                    <div className="min-h-[420px]">
                        {stocks.map(stock => {
                            const status = getStatus(stock.stock_qty);
                            return (
                                <div
                                    key={stock.id}
                                    className="grid grid-cols-12 px-8 py-4 border-b items-center text-sm"
                                >
                                    <div className="col-span-4 flex items-center gap-3">
                                        <img
                                            src={stock.product_image}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                {stock.product_name}
                                            </p>
                                            <p className="text-xs text-red-600">
                                                {stock.variant}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        ₱{stock.cost}
                                    </div>

                                    <div className="col-span-2">
                                        {stock.stock_qty}
                                    </div>

                                    <div className={`col-span-2 font-semibold ${status.color}`}>
                                        {status.label}
                                    </div>

                                    <div className="col-span-2 text-right">
                                        <button className="bg-red-700 hover:bg-red-800 text-white px-5 py-1.5 rounded-full text-xs font-semibold">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <AdminFooter />
            </div>

            {/* ADD STOCK MODAL */}
            <AddStock
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={fetchStocks}
            />
        </div>
    );
}
