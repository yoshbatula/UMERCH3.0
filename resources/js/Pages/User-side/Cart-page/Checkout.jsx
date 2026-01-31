import React from 'react';
import { Link, router } from '@inertiajs/react';
import LandingNav from '../../../components/layouts/LandingNav';
import CartsNav from '../../../components/layouts/CartsNav';
import BackgroundModel from '@images/BackgroundModel.png';
import Footer from '../../../components/layouts/Footer';
import axios from 'axios';
import PlaceOrderModal from '../../../components/modals/PlaceOrderModal';
import ReceiptForm from '../../../components/modals/ReceiptFormModal';
import { useState, useEffect } from 'react';

export default function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [fulfillmentMethod, setFulfillmentMethod] = useState('delivery');
    const [campus, setCampus] = useState('');
    const [isPlaceOrderModalOpen, setIsPlaceOrderModalOpen] = useState(false);
    const [isReceiptFormOpen, setIsReceiptFormOpen] = useState(false);
    const intervalRef = React.useRef(null);

    useEffect(() => {
        // Function to load items from sessionStorage
        const loadCheckoutItems = () => {
            const stored = sessionStorage.getItem('checkoutItems');
            console.log('Stored items:', stored);
            if (stored) {
                const items = JSON.parse(stored);
                console.log('Parsed items:', items);
                setCartItems(items);
            } else {
                // If no items in sessionStorage, redirect to cart
                router.visit('/Cart');
            }
        };

        // Load items on mount
        loadCheckoutItems();

        // Set up interval to check for changes every 500ms
        intervalRef.current = setInterval(loadCheckoutItems, 500);

        return () => clearInterval(intervalRef.current);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 6000);
    };

    const handlePlaceOrderClick = (e) => {
        e.preventDefault();

        // Validate campus selection for delivery
        if (fulfillmentMethod === 'delivery' && !campus) {
            showToast('Please select a campus for delivery', 'error');
            return;
        }

        // Open PlaceOrderModal
        setIsPlaceOrderModalOpen(true);
    };

    const handlePlaceOrderConfirm = async () => {
        setIsPlaceOrderModalOpen(false);
        setLoading(true);
        try {
            console.log('Placing order with data:', {
                payment_method: 'cashier',
                fulfillment_method: fulfillmentMethod,
                campus: fulfillmentMethod === 'delivery' ? campus : null,
                cart_items: cartItems
            });

            const response = await axios.post('/place-order', {
                payment_method: 'cashier', 
                fulfillment_method: fulfillmentMethod,
                campus: fulfillmentMethod === 'delivery' ? campus : null,
                cart_items: cartItems
            });
            
            console.log('✅ Order placed successfully:', response.data);
            
            // Clear the interval to prevent redirect to /Cart
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            // Open Receipt Form instead of redirecting
            setIsReceiptFormOpen(true);
        } catch (error) {
            console.error('❌ Order error:', error);
            console.error('❌ Error response data:', error.response?.data);
            console.error('❌ Error message:', error.message);
            console.error('❌ Full error response:', JSON.stringify(error.response?.data, null, 2));
            showToast('Error placing order. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReceiptClose = () => {
        setIsReceiptFormOpen(false);
    };

    const handleGoHome = () => {
        sessionStorage.removeItem('checkoutItems');
        router.visit('/Landing');
    };

    const handleTrackOrders = () => {
        sessionStorage.removeItem('checkoutItems');
        router.visit('/Orders');
    };

    const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    return (
        <>
            <LandingNav/>
            <div className='bg-[#F6F6F6] min-h-screen flex flex-col overflow-y-scroll'>
                <div className='bg-[#F6F6F6]'>
                    <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img 
                            src={BackgroundModel}
                            alt="Background Model"
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div className='py-7'>
                        <CartsNav/>
                    </div>
                    {/* Product order box */}
                    <div className="flex flex-col items-center justify-center py-3 gap-3">
                        <div className="p-2 flex flex-col gap-2">
                            <div className='flex flex-row justify-between'>
                                <div className='flex flex-row bg-white w-263 h-17 rounded-[10px] items-center p-6'>
                                    <h1 className='text-[20px] font-semibold'>Products Ordered</h1>
                                    <div className="flex ml-auto gap-20 text-[13px] text-[#575757] items-center">
                                        <div className='w-20 text-center'><span>Unit Price</span></div>
                                        <div className='w-20 text-center'><span>Quantity</span></div>
                                        <div className='w-32 text-center'><span>Item Subtotal</span></div>
                                    </div>
                                </div> 
                            </div>
                            <div className='flex flex-col gap-2'>
                                {cartItems.map(item => (
                                    <div key={item.cart_item_id} className='flex flex-row bg-white w-263 h-30 p-6 gap-6 items-center'>
                                        <img src={item.product?.product_image} alt={item.product?.product_name} className='w-20 h-20 rounded-[10px] object-cover flex-shrink-0'/>
                                        <div className='flex flex-col justify-center'>  
                                            <h1 className='text-[15px] font-semibold'>{item.product?.product_name}</h1>
                                            <div className='mt-2 text-[10px]'>
                                                <p className='line-clamp-2'>{item.product?.product_description}</p>
                                            </div>
                                            <div className='mt-2 text-[12px] font-medium text-gray-600'>
                                                Size: {item.variant}
                                            </div>
                                        </div>
                                        <div className='ml-auto flex gap-20 items-center'>
                                            <div className='w-20 text-center'><span className='text-[13px] font-medium'>₱{parseFloat(item.price).toFixed(2)}</span></div>
                                            <div className='w-20 text-center'><span className='text-[13px] font-medium'>{item.quantity}</span></div>
                                            <div className='w-32 text-center'><span className='text-[13px] text-[#9C0306] font-medium'>₱{(parseFloat(item.price) * item.quantity).toFixed(2)}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='flex flex-row items-start justify-center gap-3'>
                            <div className='flex flex-col gap-y-3'>
                                <div className='bg-white w-150 h-40 rounded-[10px] flex flex-col p-6 gap-4'>
                                    <h1 className='text-[20px] font-semibold'>Payment Method</h1>
                                    <div className='py-1 flex flex-row gap-10 items-center justify-center'>
                                        <div className='flex flex-row items-center gap-2'>
                                            <input type="radio" name="payment" id="cod" className='w-5 h-5 accent-[#9C0306]' defaultChecked/>
                                            <label htmlFor="cod" className='text-[20px] font-medium'>Cashier Payment</label>
                                        </div>
                                        <div className='flex flex-row items-center gap-2'>
                                            <input type="radio" name="payment" id="salary-deduction" className='w-5 h-5 accent-[#9C0306]'/>
                                            <div className='flex flex-col'>
                                                <label htmlFor="salary-deduction" className='text-[16px] font-medium'>Salary Deduction</label>
                                                <label className='text-[16px] font-medium'>(Professor Only)</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='bg-white w-150 rounded-[10px] flex flex-col p-6 gap-4'>
                                    <h1 className='text-[20px] font-semibold'>Fulfillment Method</h1>
                                    <div className='py-1 flex flex-row gap-48 items-center justify-center'>
                                        <div className='flex flex-col items-center'>
                                            <div className='flex flex-row items-center gap-2'>
                                                <input 
                                                    type="radio" 
                                                    name='fulfillment' 
                                                    className='w-5 h-5 accent-[#9C0306]' 
                                                    checked={fulfillmentMethod === 'delivery'}
                                                    onChange={() => setFulfillmentMethod('delivery')}
                                                />
                                                <label className='text-[20px] font-medium'>Delivery</label>
                                            </div>
                                        </div>
                                        <div className='flex flex-row items-center'>
                                            <div className='flex flex-row items-center gap-2 transform translate-x-[-58px]'>
                                                <input 
                                                    type="radio" 
                                                    name='fulfillment' 
                                                    className='w-5 h-5 accent-[#9C0306]'
                                                    checked={fulfillmentMethod === 'pickup'}
                                                    onChange={() => setFulfillmentMethod('pickup')}
                                                />
                                                <label className='text-[20px] font-medium'>Pick-Up</label>
                                            </div>
                                        </div>
                                    </div>
                                    {fulfillmentMethod === 'delivery' && (
                                        <div className='mt-4 flex flex-col gap-3 border-t pt-4'>
                                            <div className='flex flex-col gap-2'>
                                                <label className='text-[14px] font-medium'>Select Campus</label>
                                                <select 
                                                    value={campus}
                                                    onChange={(e) => setCampus(e.target.value)}
                                                    className='px-3 py-2 border border-[#DDDDDD] rounded-[8px] text-[13px]'
                                                >
                                                    <option value="">-- Select Campus --</option>
                                                    <option value="main">UM MAIN MATINA</option>
                                                    <option value="north">UM TAGUM</option>
                                                    <option value="south">UM PANABO</option>
                                                    <option value="east">UM PENAPLATA</option>
                                                    <option value="west">UM DIGOS</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='ml-auto flex flex-col'>
                                <form className='bg-white w-110 h-auto rounded-[10px] p-6 flex flex-col gap-4'>
                                    <div className='flex flex-row justify-between'>
                                        <h1 className='text-[16px] font-medium'>SUBTOTAL</h1>
                                        <span className='text-[16px] font-medium'>₱{total.toFixed(2)}</span>
                                    </div>
                                    <div className='flex flex-row justify-between'>
                                        <h1 className='text-[24px] text-[#9C0306] font-bold'>TOTAL</h1>
                                        <span className='text-[24px] text-[#9C0306] font-bold'>₱{total.toFixed(2)}</span>
                                    </div>

                                    <div className='py-3 flex flex-row items-center justify-center gap-3'>
                                        <div className='border border-[#9C0306] bg-white w-50 h-10 flex justify-center rounded-[20px]'>
                                            <button type="button" onClick={() => router.visit('/Cart')} className='text-[16px] font-bold text-[#9C0306] hover:cursor-pointer'>Back to Cart</button>
                                        </div>
                                        <div className='border border-[#9C0306] bg-[#9C0306] w-50 h-10 flex justify-center rounded-[20px] hover:cursor-pointer disabled:opacity-50'>
                                            <button 
                                                type="button" 
                                                onClick={handlePlaceOrderClick}
                                                disabled={loading || cartItems.length === 0} 
                                                className='text-[16px] font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer'
                                            >
                                                {loading ? 'Placing...' : 'Place Order'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <Footer/>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PlaceOrderModal 
                isOpen={isPlaceOrderModalOpen} 
                onClose={() => setIsPlaceOrderModalOpen(false)}
                onConfirm={handlePlaceOrderConfirm}
            />
            <ReceiptForm
                open={isReceiptFormOpen}
                onClose={handleReceiptClose}
                cartItems={cartItems}
                onGoHome={handleGoHome}
                onTrackOrders={handleTrackOrders}
            />

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-[70] animate-pulse ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}