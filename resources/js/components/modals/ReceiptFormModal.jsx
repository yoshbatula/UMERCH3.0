import React from 'react';
import Check from '@images/Check.svg';
import { router } from '@inertiajs/react';
import UMERCH_RECEIPT from '@images/UMERCH-RECEIPT.svg';
import QrCode from '@images/QRCODE.svg';
export default function ReceiptForm({ open, onClose, cartItems = [], onGoHome, onTrackOrders }) {
    if (!open) return null;

    const total = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) : 0;

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-black/5'
            onClick={onClose}
        >
            <div
                className="bg-[#F6F6F6] shadow-lg relative w-120 h-180 rounded-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col p-10 items-center justify-center'>
                    <img src={Check} alt="Check" />
                    <div className='py-4'>
                        <h1 className='text-[#9C0306] font-semibold text-[20px]'>Place Order Completed</h1>
                    </div>
                    <div className='flex flex-col border border-black w-80 h-110 rounded-lg bg-white'>
                        <div className='mt-3 flex flex-col items-center justify-center gap-2'>
                            <img src={UMERCH_RECEIPT} alt="UMERCH RECEIPT" className='w-10' />
                            <label htmlFor="Purchase Order" className='text-[14px] font-semibold'>Purchase Order</label>
                        </div>
                        <div className='mt-3 bg-gray-400 border opacity-30 border-gray-500 w-60'></div>
                        <div className='flex flex-col p-4 gap-2'>
                            <div className='flex flex-row justify-between text-[10px]'>
                                <span>Order#: 0001</span>
                                <span>01/30/2026</span>
                            </div>
                            <div className='border-b border-gray-300'></div>
                            <div className='flex flex-col gap-1 text-[10px]'>
                                <div>
                                    <p className='font-semibold'>Order Type:</p>
                                    <p>Cashier Payment</p>
                                </div>
                                <div>
                                    <p className='font-semibold'>Name:</p>
                                    <p>Yosh B. Batula</p>
                                </div>
                                <div>
                                    <p className='font-semibold'>ID Number:</p>
                                    <p>544580</p>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row justify-between gap-1 text-center'>
                                    <span className='text-[10px] font-bold'>Product</span>
                                    <span className='text-[10px] font-bold'>Unit Price</span>
                                    <span className='text-[10px] font-bold'>Qty</span>
                                    <span className='text-[10px] font-bold'>Subtotal</span>
                                </div>
                                {Array.isArray(cartItems) && cartItems.map((item, index) => (
                                    <div key={index} className='flex flex-row justify-between gap-1'>
                                        <span className='text-[10px]'>{item.product?.product_name || item.name || 'Product'}</span>
                                        <span className='text-[10px]'>₱{Number(item.price).toFixed(2)}</span>
                                        <span className='text-[10px]'>{item.quantity}</span>
                                        <span className='text-[10px]'>₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className='flex flex-row w-full'>
                                    <span className='text-[14px] font-bold '>TOTAL</span>
                                    <div className='ml-auto'>
                                        <span className='text-[14px] font-bold '>₱{total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className='flex flex-col mt-5 items-center'>
                                    <img src={QrCode} alt="QR Code" className='w-16 h-16'/>
                                    <p className='text-[12px] font-bold'>KEEP THIS RECEIPT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex text-center mt-5'>
                        <p className='text-[12px] text-[#9C0306]'>Note: You can take a screenshot for proof</p>
                    </div>
                    <div className='flex flex-row gap-3 items-center text-center mt-3'>
                        <button onClick={onGoHome} className='text-[12px] bg-[#9C0306] text-white w-30 h-10 font-extrabold hover:cursor-pointer'>Back to Home</button>
                        <button onClick={onTrackOrders} className='text-[12px] bg-white border border-[#9C0306] text-[#9C0306] w-30 h-10 font-extrabold hover:cursor-pointer'>Track Order</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
                      