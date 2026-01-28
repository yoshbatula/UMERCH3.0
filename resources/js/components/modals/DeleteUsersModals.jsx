import React from 'react';
import { router } from '@inertiajs/react';

export default function DeleteUsersModals({ isOpen, onClose, user, onDeleted }) {
    if (!isOpen || !user) return null;

    const handleDelete = () => {
        router.delete(`/delete-user/${user.id}`, {
            onSuccess: () => {
                if (onDeleted) onDeleted();
                onClose();
            },
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-white/5'
            onClick={onClose}
        >
            <div
                className="bg-[#F6F6F6] shadow-lg relative w-120 h-60"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col p-10 items-center justify-center'>
                    <h1>Are you sure you want to delete this user?</h1>
                    <label htmlFor="Name">{user.user_fullname}</label>
                    <label htmlFor="Email">{user.email}</label>
                    <label htmlFor="UserID">{user.um_id}</label>
                    <div className='flex flex-row gap-3 mt-5'>
                        <div className='flex justify-center items-center bg-[#9C0306] text-white text-[16px] font-semibold w-30 h-10 rounded-[5px] hover:cursor-pointer' onClick={handleDelete}>
                            Yes
                        </div>
                        <div className='flex justify-center items-center bg-white text-[#9C0306] text-[16px] font-semibold border border-[#9C0306] w-30 h-10 rounded-[5px] hover:cursor-pointer' onClick={onClose}>
                            No
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
                      