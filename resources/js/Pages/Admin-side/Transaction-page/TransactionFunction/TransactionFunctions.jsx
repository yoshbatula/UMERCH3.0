import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export const StatCard = ({ title, value, className, icon }) => (
    <div
        className={`w-[300px] h-[130px] rounded-xl px-6 py-4 text-white flex items-center justify-between ${className}`}
    >
        <div>
            <div className="text-lg opacity-90">{title}</div>
            <div className="text-4xl font-bold leading-tight mt-1">{value}</div>
        </div>

        <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            {icon}
        </div>
    </div>
);

export const Icon = ({ children }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        {children}
    </svg>
);

export const OrderModal = ({ order, isOpen, onClose, onReceiptOpen, onPrepareOpen, onDeclineOpen, onDeliverOpen, onReadyForPickupOpen }) => {
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
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${order.order_status?.toLowerCase() === 'pending' ? 'bg-gray-300 text-gray-700' :
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

export const useTransaction = () => {
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

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

    useEffect(() => {
        fetchOrders();
        // Auto-refresh orders every 3 seconds
        const interval = setInterval(fetchOrders, 3000);
        return () => clearInterval(interval);
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((order) => {
            const matchQ = !q || order?.order_id?.toString().toLowerCase().includes(q);
            const matchS = status === "All statuses" || order?.order_status === status;
            return matchQ && matchS;
        });
    }, [orders, query, status]);

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filtered.slice(startIndex, startIndex + itemsPerPage);
    const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const stats = [
        {
            title: "Completed",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'completed').length,
        },
        {
            title: "Pending",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'pending').length,
        },
        {
            title: "Processing",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'processing').length,
        },
        {
            title: "Out for Delivery",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'out-of-delivery').length,
        },
        {
            title: "Cancelled",
            value: orders.filter(o => o.order_status?.toLowerCase() === 'cancelled').length,
        },
    ];

    return {
        // State
        query,
        setQuery,
        status,
        setStatus,
        orders,
        loading,
        selectedOrder,
        setSelectedOrder,
        isModalOpen,
        setIsModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
        isPrepareModalOpen,
        setIsPrepareModalOpen,
        isDeclineModalOpen,
        setIsDeclineModalOpen,
        isDeliverModalOpen,
        setIsDeliverModalOpen,
        isReadyForPickupModalOpen,
        setIsReadyForPickupModalOpen,
        toast,
        currentPage,
        setCurrentPage,
        itemsPerPage,

        // Functions
        showToast,
        fetchOrders,
        handleOrderUpdated,
        filtered,
        totalPages,
        startIndex,
        paginatedOrders,
        endIndex,
        goToPage,
        stats,
    };
};
