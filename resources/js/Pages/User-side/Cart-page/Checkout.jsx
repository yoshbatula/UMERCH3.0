import React from 'react';
import { Link } from '@inertiajs/react';
import LandingNav from '../../../components/layouts/LandingNav';
import CartsNav from '../../../components/layouts/CartsNav';
import BackgroundModel from '@images/BackgroundModel.png';
import Tumbler from '@images/tumbler-wood.jpg';
import Footer from '../../../components/layouts/Footer';
import Ganda from '@images/gandaa.png';
export default function Checkout() {
    return (
        <>
            <LandingNav/>
            <div className='bg-[#F6F6F6] h-screen flex flex-col'>
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
                {/* Product order box */}
                <div className="flex flex-col items-center justify-center py-3 gap-3">
                    <div className="p-2 flex flex-col gap-2">
                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row bg-white w-263 h-17 rounded-[10px] items-center p-6'>
                                <h1 className='text-[20px] font-semibold'>Products Ordered</h1>
                                <div className="flex ml-auto gap-20 text-[13px] text-[#575757]">
                                    <span>Unit Price</span>
                                    <span>Quantity</span>
                                    <span>Item Subtotal</span>
                                </div>
                            </div> 
                        </div>
                        <div className='mt-4 flex flex-row gap-2'>
                            <div className='flex flex-row bg-white w-263 h-45 p-6 gap-6'>
                                <img src={Tumbler} alt="Tumbler" className='rounded-[10px]'/>
                                <div className='flex flex-col justify-center'>  
                                    <h1 className='text-[15px] font-semibold'>Wooden Tumbler</h1>
                                    <div className='mt-3 text-[10px]'>
                                        <p>Lorem ipsum dolor sit amet,</p>
                                        <p>consectetur adipiscing elit,</p>
                                    </div>
                                </div>
                                <div className='ml-auto flex justify-between items-center gap-35'>
                                    <span className='text-[13px] font-medium transform translate-x-[-8px]'>₱515</span>
                                    <span className='text-[13px] font-medium transform translate-x-[-22px]'>1</span>
                                    <span className='text-[13px] text-[#9C0306] font-medium translate-x-[-34px]'>₱515</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row items-start justify-center gap-3'>
                        <div className='flex flex-col gap-y-3'>
                            <div className='bg-white w-150 h-40 rounded-[10px] flex flex-col p-6 gap-4'>
                                <h1 className='text-[20px] font-semibold'>Payment Method</h1>
                                <div className='py-1 flex flex-row gap-10 items-center justify-center'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <input type="radio" name="payment" id="cod" className='w-5 h-5 accent-[#9C0306]'/>
                                        <label htmlFor="cod" className='text-[20px] font-medium'>Cashier Payment</label>
                                    </div>
                                    <div className='flex flex-row items-center gap-2'>
                                        <input type="radio" name="payment" id="salary-deduction" className='w-5 h-5 accent-[#9C0306]'/>
                                        <div className='flex flex-col'>
                                            <label htmlFor="salary-deduction" className='text-[16px] font-medium'>Salary Deduction</label>
                                            <label htmlFor="Professor Only" className='text-[16px] font-medium'>(Professor Only)</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white w-150 h-40 rounded-[10px] flex flex-col p-6 gap-4'>
                                <h1 className='text-[20px] font-semibold'>Fulfillment Method</h1>
                                <div className='py-1 flex flex-row gap-48 items-center justify-center'>
                                    <div className='flex flex-col items-center'>
                                        <div className='flex flex-row items-center gap-2'>
                                            <input type="radio" name='payment' className='w-5 h-5 accent-[#9C0306]'/>
                                            <label htmlFor="Deliver" className='text-[20px] font-medium'>Delivery</label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <div className='flex flex-row items-center gap-2 transform translate-x-[-58px]'>
                                            <input type="radio" className='w-5 h-5 accent-[#9C0306]'/>
                                            <label htmlFor="Pickup" className='text-[20px] font-medium'>Pick-Up</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='ml-auto flex flex-col'>
                            <div className='bg-white w-110 h-65 rounded-[10px]'>
                                    <div className='flex flex-row justify-between p-6'>
                                        <h1 className='text-[16px] font-medium'>SUBTOTAL</h1>
                                        <span className='text-[16px] font-medium'>₱515</span>
                                    </div>
                                    <div className='mt-5 flex flex-row justify-between p-6'>
                                        <h1 className='text-[24px] text-[#9C0306] font-bold'>TOTAL</h1>
                                        <span className='text-[24px] text-[#9C0306] font-bold'>₱515</span>
                                    </div>
                                    <div className='py-3 flex flex-row items-center justify-center gap-3'>
                                        <div className='border border-[#9C0306] bg-white w-50 h-10 flex justify-center rounded-[20px]'>
                                            <button className='text-[16px] font-bold text-[#9C0306]'>Back to Checkout</button>
                                        </div>
                                        <div className='border border-[#9C0306] bg-[#9C0306] w-50 h-10 flex justify-center rounded-[20px]'>
                                            <button className='text-[16px] font-bold text-white'>Place Order</button>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className='mt-5'>
                        <Footer/>
                    </div>
                </div>
                {/* initial commits */}
            </div>
           
        </>
    );
}