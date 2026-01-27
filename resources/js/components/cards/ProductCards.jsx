import React from 'react';
import ProductImage from '@images/tshirt.jpg'

export default function ProductCard({ onClick }) {
    return (
        <div>
            <div
                className="bg-white shadow-md rounded-[20px]  w-80 hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                onClick={onClick}
            >
                <div className='w-full h-64 overflow-hidden rounded-t-[20px]'>
                    <img src={ProductImage} alt="Product" className="w-full h-full object-full" />
                </div>
                <div className="mt-4 p-3 flex flex-col">
                    <div>
                        <h2 className="font-bold text-lg mb-2">UM CCE ESPORTS JERSEY</h2>
                        <p className="text-gray-600 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                    </div>
                    <div className='flex flex-row gap-2 justify-between items-center w-full'>
                        <div className='flex gap-2'>
                            <p className='font-semibold text-[18px] text-[#9C0306]'>₱500.00</p>
                            <p className='font-semibold text-[18px] text-[#969696] line-through'>₱600.00</p>
                        </div>
                        <span className='text-[10px] p-2'>125 stocks left</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
