import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function LogoutModal({ open, onClose }) {
    const { post, processing } = useForm();
    const [isLoading, setIsLoading] = useState(false);

    if (!open) return null;

    const handleLogout = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        post('/logout');
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setIsLoading(false);
        onClose();
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
                    <h1 className='text-lg font-semibold text-black'>Are you sure you want to Logout?</h1>
                    <div className='py-2 flex flex-col items-center'>
                    </div>
                    <div className='flex flex-row gap-3 mt-5'>
                        <button 
                            type='button' 
                            className='flex justify-center items-center bg-[#9C0306] text-white text-[16px] font-semibold w-30 h-10 rounded-[5px] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
                            onClick={handleLogout}
                            disabled={isLoading || processing}
                        >
                            {isLoading || processing ? 'Logging out...' : 'Yes'}
                        </button>
                        <button 
                            type='button' 
                            className='flex justify-center items-center bg-white text-[#9C0306] text-[16px] font-semibold border border-[#9C0306] w-30 h-10 rounded-[5px] hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
                            onClick={handleCancel}
                            disabled={isLoading || processing}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
                      