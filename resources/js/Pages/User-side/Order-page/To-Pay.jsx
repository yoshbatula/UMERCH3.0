import React, { useState, useEffect } from 'react';
import BackgroundModel from '@images/BackgroundModel.png';
import OrdersNav from '../../../components/layouts/OrdersNav';
import Tshirt from '@images/tshirt.jpg';
import Navbar from '../../../components/layouts/LandingNav';
import Footer from '../../../components/layouts/Footer';
import axios from 'axios';

export default function ToPay() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

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
            console.log('✅ API Response:', response.data);
            
            const orderList = Array.isArray(response.data) ? response.data : response.data?.data || [];
            
            // Filter for "To Pay" / "Pending" status orders
            const toPayOrders = orderList.filter(order => 
                order.order_status?.toLowerCase() === 'pending'
            );
            console.log('✅ To Pay Orders:', toPayOrders);
            toPayOrders.forEach(order => {
                console.log(`Order ${order.order_id} receipt_form:`, order.receipt_form);
            });
            setOrders(toPayOrders);
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (orderId) => {
        const fileInput = document.getElementById(`file-input-${orderId}`);
        fileInput?.click();
    };

    const handleFileChange = async (event, orderId) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(`✅ File selected for order ${orderId}:`, file.name);
            
            try {
                // Create FormData to send file to backend
                const formData = new FormData();
                formData.append('receipt_form', file);
                
                console.log(`⏳ Uploading file for order ${orderId}...`);
                
                // Send to backend to save in database
                const response = await axios.post(`/api/orders/${orderId}/upload-receipt`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                console.log(`✅ File uploaded successfully:`, response.data);
                console.log(`Upload Response Order ID:`, response.data?.order_id);
                console.log(`Upload Response receipt_form:`, response.data?.receipt_form);
                
                // Show success toast
                showToast('File uploaded successfully!', 'success');
                
                // Refresh orders to get updated receipt_form status
                setLoading(true);
                await fetchOrders();
            } catch (error) {
                console.error(`❌ Error uploading file for order ${orderId}:`, error);
                const errorMsg = error.response?.data?.message || error.message || 'Error uploading file. Please try again.';
                showToast(errorMsg, 'error');
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar/>
                <div className="bg-[#F6F6F6] flex flex-col">
                    <div className='bg-[#F6F6F6]'>
                        <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                            <img 
                            src={BackgroundModel}
                            alt="Background Model"
                            className='w-full h-full object-cover'
                            />
                        </div>
                    </div>
                    <div>
                        <OrdersNav/>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 py-10">
                        <p>Loading orders...</p>
                    </div>
                    <Footer/>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar/>
            <div className="bg-[#F6F6F6] flex flex-col">
                <div className='bg-[#F6F6F6]'>
                    <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img 
                        src={BackgroundModel}
                        alt="Background Model"
                        className='w-full h-full object-cover'
                        />
                    </div>
                </div>
                <div>
                    <OrdersNav/>
                </div>
                <div className="flex flex-col items-center justify-center p-4 py-10 gap-5">
                    {orders.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">
                            <p>No orders to pay</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.order_id} className='flex flex-col bg-white w-300 h-auto rounded-[10px]'>
                                <div className='flex flex-row p-4'>
                                    <h1 className='text-[#575757] text-[13px]'>Order ID: {order.order_id || 'N/A'}</h1>
                                    <div className='ml-auto flex'>
                                        <h1 className='text-[#9C0306] text-[16px] font-semibold'>To Pay</h1>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <div className='bg-[#9C9C9C] w-full h-[1px]'></div>
                                </div>
                                <div className='p-4'>
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
                                    </div>
                                </div>
                                <div>
                                    <div className='bg-[#9C9C9C] w-full h-[1px]'></div>
                                </div>
                                <div className="py-5 flex flex-row ml-auto items-center gap-5 p-4">
                                    <span className="text-[#5C5C5C] text-[13px] font-medium">Order Total:</span>
                                    <h1 className="text-[#9C0306] text-[20px] font-medium">₱{Number(order.order_total || 0).toFixed(2)}</h1>
                                </div>
                                <div className="flex flex-row ml-auto items-center gap-5 p-4">
                                    <span className={`text-[13px] font-medium underline ${order.receipt_form ? 'text-green-600' : 'text-[#031A9C]'}`}>
                                        {order.receipt_form ? 'File Uploaded' : 'Upload Proof of Payment Here'}
                                    </span>
                                    <div className="bg-[#9C0306] text-white w-30 h-9 flex items-center justify-center rounded-[20px] hover:cursor-pointer" onClick={() => handleFileUpload(order.order_id)}>
                                        <button className="text-[12px] font-medium hover:cursor-pointer">
                                            {order.receipt_form ? '✓ Uploaded' : 'Upload File'}
                                        </button>
                                    </div>
                                    <input 
                                        id={`file-input-${order.order_id}`}
                                        type="file" 
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange(e, order.order_id)}
                                        style={{ display: 'none' }}
                                    />
                                </div> 
                            </div>
                        ))
                    )}
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
            </div>
        </>
    );
}