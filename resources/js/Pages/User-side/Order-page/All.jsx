import React, { useState, useEffect } from "react";
import Tshirt from '@images/tshirt.jpg';
import axios from 'axios';

export default function All() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        // Auto-refresh orders every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            console.log('Fetching orders from /api/orders...');
            const response = await axios.get('/api/orders');
            console.log('✅ API Response Status:', response.status);
            console.log('✅ API Response Data:', response.data);
            console.log('✅ Data Type:', typeof response.data);
            console.log('✅ Is Array?', Array.isArray(response.data));
            console.log('✅ Length:', response.data?.length);
            
            const orderList = Array.isArray(response.data) ? response.data : response.data?.data || [];
            console.log('✅ Processed orders:', orderList);
            setOrders(orderList);
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            console.error('❌ Error details:', error.response?.data);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'text-yellow-600';
            case 'confirmed':
                return 'text-blue-600';
            case 'processing':
                return 'text-blue-600';
            case 'ready':
                return 'text-green-600';
            case 'completed':
                return 'text-green-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        if (!status) return 'Pending';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-4 py-10">
                <p>Loading orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-4 py-10">
                <p className="text-gray-500">No orders found</p>
                <p className="text-gray-400 text-sm mt-2">Check browser console (F12) for API errors</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center p-4 py-10 gap-5">
            {orders.map((order) => (
                <div key={order.order_id} className="flex flex-col bg-white w-300 h-auto rounded-[10px]">
                    <div className="flex flex-row w-full p-4">
                        <h1 className="text-[#575757] text-[13px]">Order ID: {order.order_id || 'N/A'}</h1>
                        <div className="ml-auto flex flex-row gap-2">
                            <h1 className={`text-[16px] font-semibold ${getStatusColor(order.order_status)}`}>
                                {getStatusLabel(order.order_status)}
                            </h1>
                        </div>
                    </div>
                    <div className="py-8 p-4">
                        <div className="flex flex-col gap-4">
                            {order.order_items && order.order_items.length > 0 ? (
                                order.order_items.map((item, index) => (
                                    <div key={index} className="flex flex-row items-center justify-center gap-2 w-full border-b pb-4 last:border-b-0">
                                        <img 
                                            src={item.product?.product_image || Tshirt} 
                                            alt={item.product?.product_name || 'product'} 
                                            className="w-20 h-20 rounded-[10px] object-cover" 
                                        />
                                        <div className="flex flex-col items-start justify-center gap-1">
                                            <h1 className="text-[15px] font-semibold">{item.product?.product_name || 'Product'}</h1>
                                            <span className="text-[10px]">{item.variant || 'N/A'}</span>
                                            <span className="text-[10px] text-[#9C0306]">x{item.quantity || 1}</span>
                                        </div>
                                        <div className="flex ml-auto items-center justify-center">
                                            <h1 className="text-[13px] text-[#9C0306] font-medium">₱{Number(item.price || 0).toFixed(2)}</h1>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No items in this order</p>
                            )}
                            <div className="py-3 flex flex-row ml-auto items-center gap-5">
                                <span className="text-[#5C5C5C] text-[13px] font-medium">Order Total:</span>
                                <h1 className="text-[#9C0306] text-[20px] font-medium">₱{Number(order.order_total || 0).toFixed(2)}</h1>
                            </div>
                            {/* {order.order_status?.toLowerCase() === 'pending' && (
                                <div className="flex flex-row ml-auto items-center gap-5 mt-3">
                                    <span className="text-[#031A9C] text-[13px] font-medium underline">Upload Proof of Payment Here</span>
                                    <div className="bg-[#9C0306] text-white w-30 h-9 flex items-center justify-center rounded-[20px] hover:cursor-pointer">
                                        <button className="text-[12px] font-medium">Upload File</button>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}