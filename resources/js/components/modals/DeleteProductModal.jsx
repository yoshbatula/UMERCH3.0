import React, { useState } from 'react';

export default function DeleteProductModal({ open, onClose, product, onDeleted }) {
    const [error, setError] = useState('');

    if (!open || !product) return null;

    const handleDelete = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`/admin/products/${product.product_id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json();

            if (data.success) {
                if (onDeleted) onDeleted();
                onClose();
            } else {
                setError(data.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('An error occurred while deleting the product');
        }
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-black/5'
            onClick={handleClose}
        >
            <div
                className="bg-[#F6F6F6] shadow-lg relative w-120 rounded-2xl p-10"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-center font-semibold text-lg mb-2'>Are you sure you want to remove this product?</h1>
                    {error && (
                        <div className='mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center'>
                            {error}
                        </div>
                    )}
                    <div className='py-2 flex flex-col items-center'>
                    </div>
                    <div className='flex flex-row gap-3 mt-5'>
                        <button type='button' className='flex justify-center items-center bg-[#9C0306] text-white text-[16px] font-semibold w-30 h-10 rounded-[5px] hover:cursor-pointer hover:bg-red-900' onClick={handleDelete}>
                            Yes
                        </button>
                        <button type='button' className='flex justify-center items-center bg-white text-[#9C0306] text-[16px] font-semibold border border-[#9C0306] w-30 h-10 rounded-[5px] hover:cursor-pointer hover:bg-gray-50' onClick={handleClose}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
