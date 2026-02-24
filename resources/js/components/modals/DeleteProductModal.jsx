import React, { useState } from 'react';

export default function DeleteProductModal({ open, onClose, product, onDeleted, onShowToast }) {
    const [isLoading, setIsLoading] = useState(false);

    if (!open || !product) return null;

    const handleDelete = async (e) => {
        e.preventDefault();
        setIsLoading(true);

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
                setIsLoading(false);
                onClose();
            } else {
                if (onShowToast) onShowToast(data.message || 'Failed to delete product', 'error');
                setIsLoading(false);
                onClose();
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (onShowToast) onShowToast('An error occurred while deleting the product', 'error');
            setIsLoading(false);
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-black/5'
            onClick={handleClose}
        >
            <div
                className="bg-[#F6F6F6] shadow-lg relative w-130 h-40 rounded-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col items-center justify-center p-10'>
                    <h1 className='text-center font-semibold text-lg mb-2'>Are you sure you want to remove this product?</h1>
                    <div className='py-2 flex flex-col items-center'>
                    </div>
                    <div className='flex flex-row gap-3'>
                        <button
                            type='button'
                            disabled={isLoading}
                            className='flex justify-center items-center bg-[#9C0306] text-white text-[16px] font-semibold w-30 h-10 rounded-[5px] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={handleDelete}
                        >
                            {isLoading ? 'Deleting...' : 'Yes'}
                        </button>
                        <button
                            type='button'
                            disabled={isLoading}
                            className='flex justify-center items-center bg-white text-[#9C0306] text-[16px] font-semibold border border-[#9C0306] w-30 h-10 rounded-[5px] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                            onClick={onClose}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
