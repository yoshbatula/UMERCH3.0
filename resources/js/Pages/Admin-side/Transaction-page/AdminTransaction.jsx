import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
import PrepareModal from "../../../components/modals/PrepareModal";
import DeclineModal from "../../../components/modals/DeclineModal";
import DeliverModal from "../../../components/modals/DeliverModal";
import ReadyForPickupModal from "../../../components/modals/ReadyForPickupModal";
import ViewReceiptFormModal from "../../../components/modals/ViewReceiptFormModal";
import axios from "axios";



const StatCard = ({ title, value, className, icon }) => (
    <div
        className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}
    >
        <div>
            <div className="text-lg opacity-90">{title}</div>
            <div className="text-4xl font-bold leading-tight mt-1">{value}</div>
        </div>

        <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
            {icon}
        </div>
    </div>
);

const Icon = ({ children }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {children}
    </svg>
);

const OrderModal = ({ order, isOpen, onClose, onReceiptOpen, onPrepareOpen, onDeclineOpen, onDeliverOpen, onReadyForPickupOpen }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-red-700">{order.user_fullname || 'Customer'}</h2>
                        <p className="text-gray-600 text-sm">Order ID: {order.order_id}</p>
                    </div>
                    <div className="flex gap-3">
                        {order.receipt_form && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                    onReceiptOpen();
                                }}
                                className="text-red-700 hover:text-red-900 font-semibold"
                            >
                                View File
                            </button>
                        )}
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                            order.order_status?.toLowerCase() === 'pending' ? 'bg-gray-300 text-gray-700' :
                            order.order_status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                            {order.order_status || 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Products */}
                <div className="space-y-4 mb-8 pb-8 border-b">
                    {order.order_items?.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                            {item.product?.product_image && (
                                <img
                                    src={item.product.product_image}
                                    alt={item.product.product_name}
                                    className="w-20 h-20 rounded object-cover"
                                />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.product?.product_name || 'Product'}</h3>
                                <p className="text-gray-600 text-sm">{item.variant || 'Standard'}</p>
                                <div className="flex justify-between items-end mt-2">
                                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                                    <p className="text-red-700 font-bold text-lg">₱{Number(item.price || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Details */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between">
                        <span className="text-gray-700">Payment Method:</span>
                        <span className="font-semibold">{order.payment_method || 'Cashier Payment'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700">Fulfillment Method:</span>
                        <span className="font-semibold">{order.fulfillment_method || 'Delivery'}</span>
                    </div>
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center mb-8 pb-8 border-b">
                    <span className="text-gray-700 font-medium">Order Total:</span>
                    <span className="text-red-700 text-3xl font-bold">₱{Number(order.order_total || 0).toFixed(2)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    {order.order_status?.toLowerCase() === 'pending' && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                    onPrepareOpen();
                                }}
                                className="flex-1 bg-[#9C0306] hover:cursor-pointer text-white py-3 rounded-[10px] font-semibold"
                            >
                                Prepare
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                    onDeclineOpen();
                                }}
                                className="flex-1 border-2 border-[#9C0306] text-[#9C0306] hover:cursor-pointer py-3 rounded-[10px] font-semibold"
                            >
                                Decline
                            </button>
                        </>
                    )}
                    {order.order_status?.toLowerCase() === 'processing' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                onDeliverOpen();
                            }}
                            className="flex-1 bg-[#9C0306] hover:cursor-pointer text-white py-3 rounded-[10px] font-semibold"
                        >
                            To Deliver
                        </button>
                    )}
                    {order.order_status?.toLowerCase() === 'out-of-delivery' && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                onReadyForPickupOpen();
                            }}
                            className="flex-1 bg-[#9C0306] hover:cursor-pointer text-white py-3 rounded-[10px] font-semibold"
                        >
                            Ready for Pickup
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function AdminTransaction() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All statuses");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isPrepareModalOpen, setIsPrepareModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
    const [isReadyForPickupModalOpen, setIsReadyForPickupModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchOrders();
        // Auto-refresh orders every 3 seconds
        const interval = setInterval(fetchOrders, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/admin/orders');
            console.log('✅ Admin Orders:', response.data);
            setOrders(Array.isArray(response.data) ? response.data : response.data?.data || []);
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderUpdated = async () => {
        // Refresh orders and update selected order
        await fetchOrders();
        // Refresh the selected order data
        if (selectedOrder) {
            try {
                const response = await axios.get('/api/admin/orders');
                const updated = Array.isArray(response.data) ? response.data : response.data?.data || [];
                const refreshedOrder = updated.find(o => o.order_id === selectedOrder.order_id);
                if (refreshedOrder) {
                    setSelectedOrder(refreshedOrder);
                }
            } catch (error) {
                console.error('❌ Error refreshing selected order:', error);
            }
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((order) => {
            const matchQ = !q || order?.order_id?.toString().toLowerCase().includes(q);
            const matchS = status === "All statuses" || order?.order_status === status;
            return matchQ && matchS;
        });
    }, [orders, query, status]);

    const stats = [
        {
            title: "Completed",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'completed').length,
            className: "bg-[#5C975A]",
            icon: (
                <Icon>
                    <path
                        d="M20 6L9 17l-5-5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Icon>
            ),
        },
        {
            title: "Pending",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'pending').length,
            className: "bg-[#F7962A]",
            icon: (
                <Icon>
                    <path
                        d="M12 6v6l4 2"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="white"
                        strokeWidth="2.2"
                    />
                </Icon>
            ),
        },
        {
            title: "Processing",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'processing').length,
            className: "bg-[#4F46E5]",
            icon: (
                <Icon>
                    <path
                        d="M12 6v6l4 2"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="white"
                        strokeWidth="2.2"
                    />
                </Icon>
            ),
        },
        {
            title: "Out for Delivery",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'out-of-delivery').length,
            className: "bg-[#EF2F2A]",
            icon: (
                <Icon>
                    <path
                        d="M3 7h11v10H3V7z"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M14 10h4l3 3v4h-7v-7z"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M7 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        fill="white"
                    />
                </Icon>
            ),
        },
        {
            title: "Cancelled",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'cancelled').length,
            className: "bg-[#9C0306]",
            icon: (
                <Icon>
                    <path
                        d="M12 22a10 10 0 100-20 10 10 0 000 20z"
                        stroke="white"
                        strokeWidth="2.2"
                    />
                    <path
                        d="M15 9l-6 6M9 9l6 6"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                    />
                </Icon>
            ),
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
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"> <path d="M21 21l-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                            <path
                                d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                                stroke="#9CA3AF"
                                strokeWidth="2"
                            />
                        </svg>

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
                        filtered.map((order) => (
                            <div
                                key={order.order_id}
                                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition"
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
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        order.order_status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.order_status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.order_status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.order_status || 'Pending'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        order.receipt_form ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.receipt_form ? 'File Uploaded' : 'No file uploaded'}
                                    </span>
                                </div>

                                {/* Right - Total + Action */}
                                <div className="flex items-center gap-6 justify-end">
                                    <div className="text-right">
                                        <p className="text-xs text-red-600 font-semibold">To Pay</p>
                                        <p className="text-lg font-bold text-red-700">₱{Number(order.order_total || 0).toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        ℹ️
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
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
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-[70] animate-pulse ${
                        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}
