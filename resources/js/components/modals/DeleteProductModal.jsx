import React from 'react';
import { router } from '@inertiajs/react';

export default function DeleteProductModal({ open, onClose, product, onDeleted }) {
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
                className="bg-[#F6F6F6] shadow-lg relative w-120 h-40"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col p-10 items-center justify-center'>
                    <h1>Are you sure you want to remove this product?</h1>
                    <div className='py-2 flex flex-col items-center'>
                    </div>
                    <div className='flex flex-row gap-3 mt-5'>
                        <button type='button' className='flex justify-center items-center bg-[#9C0306] text-white text-[16px] font-semibold w-30 h-10 rounded-[5px] hover:cursor-pointer' onClick={handleDelete}>
                            Yes
                        </button>
                        <button type='button' className='flex justify-center items-center bg-white text-[#9C0306] text-[16px] font-semibold border border-[#9C0306] w-30 h-10 rounded-[5px] hover:cursor-pointer' onClick={onClose}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
                      