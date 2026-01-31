import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import AdminFooter from "../../../components/layouts/AdminFooter";
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

const OrderModal = ({ order, isOpen, onClose }) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-semibold">{order.order_id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-semibold ${
                            order.order_status?.toLowerCase() === 'pending' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                            {order.order_status || 'Pending'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold">₱{Number(order.order_total || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Receipt:</span>
                        <span className={`font-semibold ${order.receipt_form ? 'text-green-600' : 'text-yellow-600'}`}>
                            {order.receipt_form ? '✓ Uploaded' : 'Pending'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-semibold text-sm">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <h3 className="font-semibold mb-3">Items:</h3>
                <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                    {order.order_items?.map((item, idx) => (
                        <div key={idx} className="border-b pb-2 text-sm">
                            <p className="font-medium">{item.product?.product_name || 'Product'}</p>
                            <p className="text-gray-600">Qty: {item.quantity} × ₱{Number(item.price || 0).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {order.receipt_form && (
                    <a
                        href={`/storage/${order.receipt_form}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700"
                    >
                        View Receipt
                    </a>
                )}

                <button
                    onClick={onClose}
                    className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                >
                    Close
                </button>
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

    useEffect(() => {
        fetchOrders();
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
            title: "Delivering",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'processing').length,
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

                <h2 className="text-xl font-bold mt-10">Orders</h2>

                {/* SEARCH + STATUS */}
                <div className="mt-4 flex items-center justify-between gap-6">
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
                <div className="bg-white rounded-xl mt-6 shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Receipt</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No orders found</td>
                                </tr>
                            ) : (
                                filtered.map((order) => (
                                    <tr key={order.order_id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.order_id}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                order.order_status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.order_status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                                                order.order_status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {order.order_status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                order.receipt_form ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.receipt_form ? '✓ Uploaded' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold">₱{Number(order.order_total || 0).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                View Info
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminFooter />
            </main>

            <OrderModal
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
