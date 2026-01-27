import React from 'react';
import HeroBg from '@images/model.jpg'
export default function Hero() {
    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='relative w-full'>
                <img src={HeroBg} alt="Hero Background" className='object-cover w-full h-[30rem]'/>
                <div className='absolute inset-0 bg-black opacity-60'></div>
                <div className='absolute inset-0 bg-amber-300 opacity-16'></div>
                <div className='absolute inset-0 flex flex-col justify-center items-center'>
                    <div className='flex flex-col text-start text-white transform translate-x-[230px]'>
                        <p className='text-[16px] font-semibold mb-3'>EXPLORE</p>
                        <div className='text-[56px] font-semibold font-CormorantGaramond' style={{fontFamily: "'Cormorant Garamond', serif"}}>
                            <h1>Elevate your fashion, embrace</h1>
                            <h1>UM Timeless Style!</h1>
                        </div>
                        <div className='text-[14px] font-semibold'>
                            <p>Explore our collections today and experience the joy of fashion.</p>
                            <p>Shop now for the ultimate casual style!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}