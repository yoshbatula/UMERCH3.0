import React from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import AddStock from "../../../components/modals/AddStocksModal";
import EditStock from "../../../components/modals/EditStocks";
import ReceiptForm from "../../../components/modals/ReceiptFormModal";
import { useStockIn } from "./InventoryFunction/StockInFunctions";

/* ✅ ICONS */
import TotalStocks from "@images/TotalStocks.svg";
import LowStocks from "@images/LowStocks.svg";
import OutOfStocks from "@images/OutOfStocks.svg";
import SearchIcon from "@images/SearchIcon.svg";

// ✅ Stat Card (SIZE UNCHANGED, ICON BIG)
const StatCard = ({ title, value, bg, icon }) => (
    <div className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${bg}`}>
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

export default function StockIn() {
    const { stocks, filteredStocks, searchQuery, setSearchQuery, openAdd, setOpenAdd, openEdit, setOpenEdit, selectedStock, setSelectedStock,
        toast, showingToast, receiptFormOpen, openReceiptForm,
        closeReceiptForm, fetchStocks, showToast, getStatus, } = useStockIn();

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

                {/* Header */}
                <h2 className="text-2xl font-bold mb-4">Stock In</h2>

                <div className=" flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 max-w-[520px] h-12 bg-white rounded-lg px-4 py-3 border border-gray-200">
                        <img src={SearchIcon} alt="Search" className="w-5 h-5" />

                        <input
                            type="text"
                            placeholder="Search Product Name"
                            className="bg-transparent outline-none w-full text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setOpenAdd(true)}
                        className="bg-red-800 hover:bg-red-900 text-white px-8 py-2 rounded-full text-sm font-semibold hover:cursor-pointer"
                    >
                        Add Stock
                    </button>
                </div>


                {/* TABLE */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 px-8 py-4 text-sm font-bold text-red-700 border-b border-gray-400/30">
                        <div className="col-span-4">Product</div>
                        <div className="col-span-2">Cost</div>
                        <div className="col-span-2">Stocks</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    <div className="min-h-[420px]">
                        {filteredStocks.map(stock => {
                            const status = getStatus(stock.stock_qty);
                            return (
                                <div
                                    key={stock.stock_in_id}
                                    className="grid grid-cols-12 px-8 py-4 border-b border-gray-400/30 items-center text-sm"
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
                                        <button
                                            className="bg-red-700 hover:bg-red-800 text-white px-5 py-1.5 rounded-full text-xs font-semibold hover:cursor-pointer"
                                            onClick={() => { setSelectedStock(stock); setOpenEdit(true); }}
                                        >
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
            {
                showingToast && (
                    <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
                        {toast}
                    </div>
                )
            }
            {/* ADD STOCK MODAL */}
            <AddStock
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={() => { fetchStocks(); showToast("Stock added successfully!"); }}
            />

            {/* EDIT STOCK MODAL */}
            <EditStock
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                stock={selectedStock}
                onSuccess={() => { fetchStocks(); showToast("Stock updated successfully!"); }}
            />
            {/* RECEIPT FORM MODAL */}
            <ReceiptForm
                open={receiptFormOpen}
                onClose={closeReceiptForm}
            />
        </div >
    );
}
