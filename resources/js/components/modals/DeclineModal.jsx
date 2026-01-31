import React from 'react';
import axios from 'axios';

export default function DeclineModal({ open, onClose, product, onDeleted, onBackToOrder, onShowToast }) {
    if (!open || !product) return null;

    const handleDecline = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/orders/${product.order_id}/status`, {
                status: 'Cancelled'
            });
            if (onShowToast) onShowToast('Order declined successfully!', 'success');
            if (onDeleted) onDeleted();
            setTimeout(() => {
                onClose();
            }, 500);
        } catch (error) {
            console.error('Error declining order:', error);
            if (onShowToast) onShowToast('Failed to decline order', 'error');
            alert('Failed to decline order');
        }
    };

    return (
        <div
            className='fixed inset-0 z-[60] flex justify-center items-center backdrop-blur-xs bg-black/5'
            onClick={onClose}
        >
            <div
                className="bg-[#F6F6F6] shadow-lg relative w-120 h-40 rounded-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col p-10 items-center justify-center'>
                    <h1>Are you sure you want to decline this order?</h1>
                    <div className='py-2 flex flex-col items-center'>
                    </div>
                    <div className='flex flex-row gap-3 mt-5'>
                        <button type='button' className='flex justify-center items-center bg-[#9C0306] text-white text-[16px] font-semibold w-30 h-10 rounded-[5px] hover:cursor-pointer' onClick={(e) => { e.stopPropagation(); handleDecline(e); }}>
                            Yes
                        </button>
                        <button type='button' className='flex justify-center items-center bg-white text-[#9C0306] text-[16px] font-semibold border border-[#9C0306] w-30 h-10 rounded-[5px] hover:cursor-pointer' onClick={(e) => { e.stopPropagation(); onBackToOrder(); }}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
                      