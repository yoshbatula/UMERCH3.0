import React, { useState, useEffect } from 'react';
import BackgroundModel from '@images/BackgroundModel.png';
import OrdersNav from '../../../components/layouts/OrdersNav';
import Tshirt from '@images/tshirt.jpg';
import Navbar from '../../../components/layouts/LandingNav';
import Footer from '../../../components/layouts/Footer';
import axios from 'axios';

export default function Cancelled() {
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
            const response = await axios.get('/api/orders');
            const allOrders = Array.isArray(response.data) ? response.data : response.data?.data || [];
            // Filter orders with Cancelled status
            const cancelledOrders = allOrders.filter(order => order.order_status?.toLowerCase() === 'cancelled');
            setOrders(cancelledOrders);
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
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
                        <p className="text-gray-500">No cancelled orders</p>
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
                    {orders.map((order) => (
                        <div key={order.order_id} className="flex flex-col bg-white w-300 h-auto rounded-[10px]">
                            <div className='flex flex-row p-4'>
                                <h1 className='text-[#575757] text-[13px]'>Order ID: {order.order_id}</h1>
                                <div className='ml-auto flex gap-2'>
                                    <h1 className='text-[16px] text-[#9C0306]'>Cancelled</h1>
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
                            <div className='mt-4 p-4'>
                                <div className='text-center text-[13px] text-[#9C0306] mb-3'>
                                    Due to upload error
                                </div>
                            </div>
                            <div className="py-5 flex flex-row ml-auto items-center gap-5 p-4">
                                <span className="text-[#5C5C5C] text-[13px] font-medium">Order Total:</span>
                                <h1 className="text-[#9C0306] text-[20px] font-medium">₱{Number(order.order_total || 0).toFixed(2)}</h1>
                            </div>
                            <div className='p-4 flex flex-row ml-auto items-center'>
                                <button className='w-30 bg-white border border-[#9C0306] text-[#9C0306] text-[14px] py-2 rounded-[10px] hover:cursor-pointer'>
                                    Reupload File
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </>
    );
}