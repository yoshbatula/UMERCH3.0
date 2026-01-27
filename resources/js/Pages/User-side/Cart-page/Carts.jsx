import React, { useState } from 'react';
import Navbar from '../../../components/layouts/LandingNav';
import BackgroundModel from '@images/BackgroundModel.png'; 
import { Link, usePage } from '@inertiajs/react';
import ClothingItems from '../../../components/ui/ClothingItems';
import AccessoriesItems from '../../../components/ui/AccessoriesItems';
import CartsNav from '../../../components/layouts/CartsNav';
import Footer from '../../../components/layouts/Footer';

export default function Carts() {
    
    const [quantity, setQuantity] = useState(1);
    return (
        <>
            <div className='bg-[#F6F6F6] h-screen'>
                <Navbar/>
                <div className='bg-[#F6F6F6]'>
                    <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img 
                        src={BackgroundModel}
                        alt="Background Model"
                        className='w-full h-full object-cover'
                        />
                    </div>
                    <div className='py-7'>
                        <CartsNav/>
                    </div>
                    <div className='flex flex-col items-center justify-center py-3 gap-3'>
                        <div className='p-2 flex flex-col gap-6'> 
                            <div className='flex flex-row'>
                                <div className='flex flex-row bg-white w-263 h-17 rounded-[10px] items-center p-3'>
                                <div className='gap-2 flex flex-row items-center'>
                                    <input type="checkbox" className='w-3 h-3 accent-[#9C0306]'/>
                                    <span className='text-[13px] text-[#575757]'>Product</span>
                                </div>
                                <div className='ml-auto flex flex-row gap-21 text-[13px] text-[#575757]'>
                                    <span>Unit price</span>
                                    <span>Quantity</span>
                                    <span>Total Price</span>
                                    <span className='transform translate-x-[-17px]'>Actions</span>
                                </div>
                            </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <AccessoriesItems/>
                                <ClothingItems/>
                            </div>
                        </div>
                        <div className='mt-4 flex flex-row justify-center items-center gap-3'>
                            <div className='flex justify-center items-center w-65 h-8 border text-[#9C0306] border-[#9C0306] rounded-[10px] hover:cursor-pointer hover:bg-[#9C0306] hover:text-white transition duration-300'>
                                <button className='text-[13px] font-bold hover:cursor-pointer'>Continue Shopping</button>
                            </div>
                        </div>
                        <div className='mt-3 flex flex-col justify-center bg-white w-263 h-65 rounded-[10px]'>
                            <div className='flex justify-start px-4'>
                                <h1 className='text-[24px] font-semibold'>Cart Total</h1>
                            </div>
                            <div className='mt-3 flex flex-row justify-between px-4'>
                                <h1 className='text-[16px] font-medium'>SUBTOTAL</h1>
                                <h1 className='text-[16px] font-medium'>₱1015</h1>
                            </div>
                            <div className='mt-10 flex flex-row justify-between px-4'>
                                <h1 className='text-[#9C0306] text-[24px] font-bold'>TOTAL</h1>
                                <h1 className='text-[#9C0306] text-[24px] font-bold'>₱1015</h1>
                            </div>
                            
                            <div className='px-7 flex justify-center items-center'>
                                <div className='mt-7 ml-auto flex justify-center items-center bg-[#9C0306] rounded-[10px] w-48 h-8 hover:cursor-pointer'>
                                    <button className='text-[#F6F6F6] text-[13px] font-bold hover:cursor-pointer'>Proceed to Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <Footer/>
                    </div>
                </div>
            </div>
        </>
    );
}