import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function DeleteUsersModals({ isOpen, onClose, user, onDeleted, onError }) {
    if (!isOpen || !user) return null;

    const [deleteError, setDeleteError] = useState('');

    const handleDelete = () => {
        setDeleteError('');
        router.delete(`/admin/delete-user/${user.id}`, {
            onSuccess: (page) => {
                const flash = page?.props?.flash;
                if (flash?.error) {
                    if (onError) onError(flash.error);
                    return;
                }
                if (onDeleted) onDeleted();
                onClose();
            },
            onError: () => {
                if (onError) onError('Failed to delete user. Please try again.');
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center bg-black/70'
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-[600px] p-10"
                onClick={e => e.stopPropagation()}
            >
                {/* Title */}
                <h1 className="text-3xl font-bold text-[#9C0306] text-center mb-6">
                    Confirm Deletion
                </h1>

                {/* Confirmation Text */}
                <p className="text-center text-black text-lg font-medium mb-8">
                    Are you sure you want to permanently this user?
                </p>

                {/* User Details */}
                <div className='mb-10 text-center space-y-2'>
                    <div className='text-base text-black'>
                        <span className="font-normal">Name: </span>
                        <span className="font-normal">{user.user_fullname || user.name}</span>
                    </div>
                    <div className='text-base text-black'>
                        <span className="font-normal">Email: </span>
                        <span className="font-normal">{user.email || user.user_email}</span>
                    </div>
                    <div className='text-base text-black'>
                        <span className="font-normal">UserID: </span>
                        <span className="font-normal">{user.um_id || user.userId || user.user_id}</span>
                    </div>
                </div>

                {/* Server Error Message — WB-AM-17 */}
                {deleteError && (
                    <p className="text-red-500 text-sm text-center mb-4">{deleteError}</p>
                )}

                {/* Action Buttons */}
                <div className='flex gap-6 justify-center'>
                    <button
                        className='w-52 bg-[#9C0306] text-white text-lg font-semibold py-3 rounded-md hover:bg-[#7d0205] transition-colors'
                        onClick={handleDelete}
                    >
                        Yes
                    </button>
                    <button
                        className='w-52 bg-white text-[#9C0306] text-lg font-semibold border-2 border-[#9C0306] py-3 rounded-md hover:bg-red-50 transition-colors'
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
