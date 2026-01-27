import React from 'react';
import CampusDelivery from '@images/CampusDelivery.svg';
import BestQuality from '@images/BestQuality.svg'
import BestOffer from '@images/BestOffer.svg'
import SecurePayment from '@images/SecurePayment.svg'
export default function FeatureSection() {
    return(
        <div className='bg-white'>
            <div className='p-10 flex flex-row justify-center items-center gap-30'>
                <div className='flex flex-col text-center items-center leading-tight'>
                    <img src={CampusDelivery} alt="Campus Delivery" className='w-20'/>
                    <h1 className='font-medium text-[20px] mt-3'>Campus Delivery</h1>
                    <p className='mt-5'>Lorem ipsum dolor sit amet</p>
                    <p>consectetur. Eget sed sapien</p>
                    <p>quisque et suspendisse.</p>
                </div>
                <div className='flex flex-col text-center items-center leading-tight'>
                    <img src={BestQuality} alt="Campus Delivery" className='w-20'/>
                    <h1 className='font-medium text-[20px] mt-3'>Best Quality</h1>
                    <p className='mt-5'>Lorem ipsum dolor sit amet </p>
                    <p>consectetur. Eget sed sapien</p>
                    <p>quisque et suspendisse.</p>
                </div>
                <div className='flex flex-col text-center items-center leading-tight'>
                    <img src={BestOffer} alt="Campus Delivery" className='w-20'/>
                    <h1 className='font-medium text-[20px] mt-3'>Best Offer</h1>
                    <p className='mt-5'>Lorem ipsum dolor sit amet</p>
                    <p>consectetur. Eget sed sapien</p>
                    <p>quisque et suspendisse.</p>
                </div>
                <div className='flex flex-col text-center items-center leading-tight'>
                    <img src={SecurePayment} alt="Campus Delivery" className='w-20'/>
                    <h1 className='font-medium text-[20px] mt-3'>Best Offer</h1>
                    <p className='mt-5'>Lorem ipsum dolor sit amet</p>
                    <p>consectetur. Eget sed sapien</p>
                    <p>quisque et suspendisse.</p>
                </div> 
            </div>
        </div>
    );
}