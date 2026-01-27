import React from 'react';
import BackgroundModel from '@images/BackgroundModel.png';
import LandingNav from '../../../components/layouts/LandingNav';
import All from '../../User-side/Order-page/All';
import OrdersNav from '../../../components/layouts/OrdersNav';
import Footer from '../../../components/layouts/Footer';
export default function Orders() {
    return (
        <>
            <LandingNav/>
            <div className="bg-[#F6F6F6] flex flex-col">
                <div className='bg-[#F6F6F6]'>
                    <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                        <img 
                        src={BackgroundModel}
                        alt="Background Model"
                        className='w-full h-full object-cover'
                        />
                    </div>
                </div>
                <div>
                    <OrdersNav/>
                </div>
                <div>
                    <All/>
                </div>
            </div>
            <Footer/>
        </>
    );
}