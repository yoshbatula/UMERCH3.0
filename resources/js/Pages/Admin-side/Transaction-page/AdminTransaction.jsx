import React from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import PrepareModal from "../../../components/modals/PrepareModal";
import DeclineModal from "../../../components/modals/DeclineModal";
import DeliverModal from "../../../components/modals/DeliverModal";
import ReadyForPickupModal from "../../../components/modals/ReadyForPickupModal";
import ViewReceiptFormModal from "../../../components/modals/ViewReceiptFormModal";
import { useTransaction, StatCard, OrderModal } from "./TransactionFunction/TransactionFunctions";

import CompletedIcon from "@images/Completed.svg";
import PendingIcon from "@images/Pending.svg";
import ProcessingIcon from "@images/Processing.svg";
import OutForDeliveryIcon from "@images/OutForDelivery.svg";
import CancelledIcon from "@images/Cancelled.svg";
import SearchIcon from "@images/SearchIcon.svg";

export default function AdminTransaction() {
    const { query, setQuery, status, setStatus, orders, loading, selectedOrder, setSelectedOrder, isModalOpen,
        setIsModalOpen, isReceiptModalOpen, setIsReceiptModalOpen, isPrepareModalOpen, setIsPrepareModalOpen, isDeclineModalOpen,
        setIsDeclineModalOpen, isDeliverModalOpen, setIsDeliverModalOpen, isReadyForPickupModalOpen, setIsReadyForPickupModalOpen,
        toast, currentPage, showToast, handleOrderUpdated, filtered, totalPages, paginatedOrders,
        goToPage, stats: statsData, } = useTransaction();

    const stats = [
        {
            ...statsData[0],
            className: "bg-[#5C975A]",
            icon: <img src={CompletedIcon} alt="Completed" className="w-20 h-20" />,
        },
        {
            ...statsData[1],
            className: "bg-[#F7962A]",
            icon: <img src={PendingIcon} alt="Pending" className="w-20 h-20" />,
        },
        {
            ...statsData[2],
            className: "bg-[#4F46E5]",
            icon: <img src={ProcessingIcon} alt="Processing" className="w-20 h-20" />,
        },
        {
            ...statsData[3],
            className: "bg-[#EF2F2A]",
            icon: <img src={OutForDeliveryIcon} alt="Out for Delivery" className="w-20 h-20" />,
        },
        {
            ...statsData[4],
            className: "bg-[#9C0306]",
            icon: <img src={CancelledIcon} alt="Cancelled" className="w-20 h-20" />,
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#f5f5f5]">
            <div className="h-screen sticky top-0">
                <Sidebar />
            </div>

            <main className="flex-1 px-10 py-10">
                <h1 className="text-4xl font-extrabold tracking-[0.25em]">
                    TRANSACTIONS
                </h1>
                <p className="text-gray-500 mt-2">
                    Welcome back Admin, everything looks great.
                </p>

                {/* STAT CARDS */}
                <div className="flex flex-wrap gap-6 mt-8">
                    {stats.map((s) => (
                        <StatCard key={s.title} {...s} />
                    ))}
                </div>

                <h2 className="text-2xl font-bold mt-10 mb-4">Orders</h2>

                {/* SEARCH + STATUS */}
                <div className="flex items-center justify-between gap-6 mb-4">
                    <div className="flex items-center gap-3 flex-1 max-w-[520px] bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <img src={SearchIcon} alt="Search" className="w-5 h-5" />

                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by Order ID"
                            className="bg-transparent outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-300 rounded-lg px-5 py-3 text-sm bg-white min-w-[170px]"
                        >
                            {["All statuses", "Pending", "Completed", "Processing", "Cancelled"].map(
                                (s) => (
                                    <option key={s}>{s}</option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-24 text-gray-400">
                            Loading...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24 text-gray-400">
                            No orders found
                        </div>
                    ) : (
                        paginatedOrders.map((order) => (
                            <div
                                key={order.order_id}
                                onClick={() => {
                                    setSelectedOrder(order);
                                    setIsModalOpen(true);
                                }}
                                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer hover:bg-gray-50"
                            >
                                {/* Left - Info */}
                                <div className="flex items-start flex-1">
                                    <div>
                                        <p className="font-semibold text-gray-900">{order.user_fullname || order.user?.name || 'Customer'}</p>
                                        <p className="text-sm text-gray-600">Order ID: {order.order_id}</p>
                                        <p className="text-xs text-gray-400 mt-1">{Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000)} mins ago</p>
                                    </div>
                                </div>

                                {/* Middle - Status Badges */}
                                <div className="flex items-start gap-3 flex-1">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.order_status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.order_status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.order_status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {order.order_status || 'Pending'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.receipt_form ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.receipt_form ? 'File Uploaded' : 'No file uploaded'}
                                    </span>
                                </div>

                                {/* Right - Total */}
                                <div className="flex items-center gap-6 justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-red-600 font-semibold">To Pay</p>
                                        <p className="text-lg font-bold text-red-700">₱{Number(order.order_total || 0).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <>
                        <div className="border-t border-gray-200" />
                        <div className="py-7 flex items-center justify-center gap-10 text-sm font-semibold">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className='text-gray-900 hover:text-[#9C0306] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`${page === currentPage
                                        ? 'text-[#9C0306]'
                                        : 'text-gray-900 hover:text-[#9C0306]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className='text-gray-900 hover:text-[#9C0306] disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
                <AdminFooter />
            </main>

            <OrderModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onReceiptOpen={() => setIsReceiptModalOpen(true)}
                onPrepareOpen={() => setIsPrepareModalOpen(true)}
                onDeclineOpen={() => setIsDeclineModalOpen(true)}
                onDeliverOpen={() => setIsDeliverModalOpen(true)}
                onReadyForPickupOpen={() => setIsReadyForPickupModalOpen(true)}
            />

            <ViewReceiptFormModal
                open={isReceiptModalOpen}
                onClose={() => {
                    setIsReceiptModalOpen(false);
                    setIsModalOpen(true);
                }}
                product={selectedOrder}
            />

            <PrepareModal
                open={isPrepareModalOpen}
                onClose={() => {
                    setIsPrepareModalOpen(false);
                    setIsModalOpen(false);
                }}
                onBackToOrder={() => {
                    setIsPrepareModalOpen(false);
                    setIsModalOpen(true);
                }}
                product={selectedOrder}
                onDeleted={handleOrderUpdated}
                onShowToast={showToast}
            />

            <DeclineModal
                open={isDeclineModalOpen}
                onClose={() => {
                    setIsDeclineModalOpen(false);
                    setIsModalOpen(false);
                }}
                onBackToOrder={() => {
                    setIsDeclineModalOpen(false);
                    setIsModalOpen(true);
                }}
                product={selectedOrder}
                onDeleted={handleOrderUpdated}
                onShowToast={showToast}
            />

            <DeliverModal
                open={isDeliverModalOpen}
                onClose={() => {
                    setIsDeliverModalOpen(false);
                    setIsModalOpen(false);
                }}
                onBackToOrder={() => {
                    setIsDeliverModalOpen(false);
                    setIsModalOpen(true);
                }}
                product={selectedOrder}
                onDeleted={handleOrderUpdated}
                onShowToast={showToast}
            />

            <ReadyForPickupModal
                open={isReadyForPickupModalOpen}
                onClose={() => {
                    setIsReadyForPickupModalOpen(false);
                    setIsModalOpen(false);
                }}
                onBackToOrder={() => {
                    setIsReadyForPickupModalOpen(false);
                    setIsModalOpen(true);
                }}
                product={selectedOrder}
                onDeleted={handleOrderUpdated}
                onShowToast={showToast}
            />

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-[70] animate-pulse ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
