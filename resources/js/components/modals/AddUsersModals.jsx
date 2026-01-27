import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import Tumbler from '@images/tumbler.png';
import AddToCart from '@images/Cart.svg';
export default function AddUsersModals({ isOpen, onClose }) {
    const [quantity, setQuantity] = useState(1);
    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center  backdrop-blur-xs bg-white/5'
            onClick={onClose}
        >
            <div
                className="bg-[#F6F6F6]  shadow-lg relative w-120 h-160"
                onClick={e => e.stopPropagation()}
            >
                <div className='flex flex-col'>
                    <div className='bg-[#9C0306] w-full h-20 flex items-center p-4'>
                        <h1 className='text-white text-[36px] font-semibold'>ADD USERS</h1>
                    </div>
                    <form action="#" className='mt-5'>
                        <div className='flex flex-col p-6 w-full'>
                            <div className='flex flex-col py-3'>
                                <label className='text-[20px] font-semibold'>Full Name:</label>
                                <input type="text" placeholder='Enter Full Name' className='border border-gray-300 rounded-[20px] px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400'/>
                            </div>
                            <div className='flex flex-col py-3'>
                                <label className='text-[20px] font-semibold'>Email Address</label>
                                <input type="text" placeholder='Enter Email Address' className='border border-gray-300 rounded-[20px] px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400'/>
                            </div>
                            <div className='flex flex-col py-3'>
                                <label className='text-[20px] font-semibold'>User ID:</label>
                                <input type="text" placeholder='Enter User ID' className='border border-gray-300 rounded-[20px] px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400'/>
                            </div>
                            <div className='flex flex-col py-3'>
                                <label className='text-[20px] font-semibold'>Password</label>
                                <input type="text" placeholder='Enter Password' className='border border-gray-300 rounded-[20px] px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400'/>
                            </div>
                            <div className='mt-10 ml-auto flex gap-3'>
                                <div className='bg-white text-[#9C0306] border border-[#9C0306] rounded-[5px]'>
                                    <button className="w-32 h-10 text-[20px] hover:cursor-pointer">Cancel</button>
                                </div>
                                 <div className='bg-[#9C0306] text-white rounded-[5px]'>
                                    <button className="w-32 h-10 text-[20px] hover:cursor-pointer">Add User</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> 
        </div>
    );
}