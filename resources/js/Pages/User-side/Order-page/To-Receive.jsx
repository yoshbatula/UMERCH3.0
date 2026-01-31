import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import BackgroundModel from '@images/BackgroundModel.png';
import OrdersNav from '../../../components/layouts/OrdersNav';
import Tshirt from '@images/tshirt.jpg';
import Navbar from '../../../components/layouts/LandingNav';
import Footer from '../../../components/layouts/Footer';
import axios from 'axios';

export default function ToReceive() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchOrders();
        // Auto-refresh orders every 5 seconds
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 6000);
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            const allOrders = Array.isArray(response.data) ? response.data : response.data?.data || [];
            // Filter orders with Processing, Out-of-delivery, or Ready-for-pickup status
            const toReceiveOrders = allOrders.filter(order => {
                const status = order.order_status?.toLowerCase();
                return status === 'processing' || status === 'out-of-delivery' || status === 'ready-for-pickup';
            });
            setOrders(toReceiveOrders);
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => {
        const lowerStatus = status?.toLowerCase();
        switch(lowerStatus) {
            case 'processing':
                return { label: 'Preparing', color: 'text-blue-600', detail: 'To Receive' };
            case 'out-of-delivery':
                return { label: 'Out for Delivery', color: 'text-orange-600', detail: 'Ready for Pickup' };
            case 'ready-for-pickup':
                return { label: 'Ready for Pickup', color: 'text-green-600', detail: 'Awaiting Pickup' };
            default:
                return { label: 'Processing', color: 'text-gray-600', detail: 'To Receive' };
        }
    };

    const getCampusLabel = (campusCode) => {
        const campusMap = {
            'main': 'UM MAIN MATINA',
            'north': 'UM TAGUM',
            'south': 'UM PANABO',
            'east': 'UM PENAPLATA',
            'west': 'UM DIGOS'
        };
        return campusMap[campusCode?.toLowerCase()] || campusCode;
    };

    const handleOrderReceived = async (orderId) => {
        try {
            console.log(`✅ Marking order ${orderId} as Completed...`);
            const response = await axios.put(`/api/admin/orders/${orderId}/status`, {
                status: 'Completed'
            });
            console.log('✅ Order marked as completed:', response.data);
            showToast('Order Complete', 'success');
            // Refresh orders list
            await fetchOrders();
            // Navigate to Completed page after 1 second
            setTimeout(() => {
                router.visit('/Completed');
            }, 1000);
        } catch (error) {
            console.error('❌ Error marking order as completed:', error);
            showToast('Failed to mark order as received', 'error');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar/>
                <div className="bg-[#F6F6F6] flex flex-col min-h-screen">
                    <div className='bg-[#F6F6F6]'>
                        <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                            <img src={BackgroundModel} alt="Background Model" className='w-full h-full object-cover'/>
                        </div>
                    </div>
                    <OrdersNav/>
                    <div className="flex flex-col items-center justify-center p-4 py-10">
                        <p>Loading orders...</p>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    if (orders.length === 0) {
        return (
            <>
                <Navbar/>
                <div className="bg-[#F6F6F6] flex flex-col min-h-screen">
                    <div className='bg-[#F6F6F6]'>
                        <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                            <img src={BackgroundModel} alt="Background Model" className='w-full h-full object-cover'/>
                        </div>
                    </div>
                    <OrdersNav/>
                    <div className="flex flex-col items-center justify-center p-4 py-10">
                        <p className="text-gray-500">No orders to receive</p>
                    </div>
                </div>
                <Footer/>
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <div className="bg-[#F6F6F6] flex flex-col">
                <div className='bg-[#F6F6F6]'>
                    <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img src={BackgroundModel} alt="Background Model" className='w-full h-full object-cover'/>
                    </div>
                </div>
                <div>
                    <OrdersNav/>
                </div>
                <div className="flex flex-col items-center justify-center p-4 py-10 gap-5">
                    {orders.map((order) => {
                        const statusInfo = getStatusLabel(order.order_status);
                        return (
                        <div key={order.order_id} className="flex flex-col bg-white w-300 h-auto rounded-[10px]">
                            <div className='flex flex-row p-4'>
                                <h1 className='text-[#575757] text-[13px]'>Order ID: {order.order_id}</h1>
                                <div className='ml-auto flex gap-2'>
                                    <h1 className={`text-[16px] ${statusInfo.color}`}>{statusInfo.label}</h1>
                                    <h1 className='text-[16px] text-[#9C0306]'>|</h1>
                                    <h1 className='text-[#9C0306] text-[16px]'>{statusInfo.detail}</h1>
                                    {order.campus && order.order_status?.toLowerCase() === 'ready-for-pickup' && (
                                        <>
                                            <h1 className='text-[16px] text-[#9C0306]'>|</h1>
                                            <h1 className='text-[16px] text-green-600 font-semibold'>{getCampusLabel(order.campus)}</h1>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <div className='bg-[#9C9C9C] w-full h-[1px]'></div>
                            </div>
                            <div className='p-4'>
                                <div className="flex flex-col gap-4">
                                    {order.order_items?.map((item, idx) => (
                                        <div key={idx} className="flex flex-row items-center justify-center gap-2 w-full">
                                            <img src={item.product?.product_image || Tshirt} alt={item.product?.product_name} className="w-20 h-20 rounded-[10px] object-cover" />
                                            <div className="flex flex-col items-start justify-center gap-1">
                                                <h1 className="text-[15px] font-semibold">{item.product?.product_name}</h1>
                                                <span className="text-[10px]">{item.variant}</span>
                                                <span className="text-[10px] text-[#9C0306]">x{item.quantity}</span>
                                            </div>
                                            <div className="flex ml-auto items-center justify-center">
                                                <h1 className="text-[13px] text-[#9C0306] font-medium">₱{Number(item.price || 0).toFixed(2)}</h1>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="py-5 flex flex-row ml-auto items-center gap-5 p-4">
                                <span className="text-[#5C5C5C] text-[13px] font-medium">Order Total:</span>
                                <h1 className="text-[#9C0306] text-[20px] font-medium">₱{Number(order.order_total || 0).toFixed(2)}</h1>
                            </div>
                            <div className="flex flex-row ml-auto items-center gap-5 p-4">
                                <button 
                                    onClick={() => handleOrderReceived(order.order_id)}
                                    disabled={order.order_status?.toLowerCase() !== 'ready-for-pickup'}
                                    className={`w-30 h-9 flex items-center justify-center rounded-[20px] text-[12px] font-medium transition-all ${
                                        order.order_status?.toLowerCase() === 'ready-for-pickup'
                                            ? 'bg-[#9C0306] text-[#9C0306] text-white hover:cursor-pointer'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                    }`}>
                                    <span>Order Received</span>
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
            <Footer/>
            
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
        </>
    );
}