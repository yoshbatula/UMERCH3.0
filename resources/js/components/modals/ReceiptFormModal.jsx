import React from 'react';
import Check from '@images/Check.svg';
import { router } from '@inertiajs/react';
import UMERCH_RECEIPT from '@images/UMERCH-RECEIPT.svg';
export default function ReceiptForm({ open, onClose, product, onDeleted }) {
    if (!open || !product) return null;

    const handleDelete = (e) => {
        e.preventDefault();
        router.delete(`/admin/products/${product.product_id}`, {
            onSuccess: () => {
                if (onDeleted) onDeleted();
                onClose();
            },
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-black/5'
            onClick={onClose}
        >
            <div
                className="bg-[#F6F6F6] shadow-lg relative w-120 h-50 rounded-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col p-10 items-center justify-center'>
                    <img src={Check} alt="Check" />
                    <div className='py-4'>
                        <h1 className='text-[#9C0306] font-semibold text-[20px]'>Place Order Completed</h1>
                    </div>
                    {/* <div className='flex flex-col border border-black w-60 h-100'>
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
                            <div className=''>

                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
                      