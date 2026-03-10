import React from 'react';
import {Link} from '@inertiajs/react';
import BackgroundImage from '@images/um5.jpg';
import LoginLogo from '@images/UMERCH-LOGIN-LOGO.svg';
import EmailIcon from '@images/email-icon.svg';
import PasswordIcon from '@images/password-icon.svg';
export default function Knowledge({ showLogin, onCloseLogin }) {
    return (
        <div className='relative min-h-[60vw] sm:min-h-[40vw] lg:min-h-screen flex flex-col'>
            {/* Background image */}
            <div className='absolute inset-0 z-0'>
                <img src={BackgroundImage} alt="UM-LOGO" className='w-full h-full object-cover'/>
                <div className='absolute inset-0 bg-black opacity-60'></div>
            </div>
            {/* Content */}
            <div className='relative z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 sm:py-20 min-h-[60vw] sm:min-h-[40vw] lg:min-h-screen'>
                <div className='flex flex-col text-center lg:text-left max-w-2xl'>
                    <h1 className='text-[14px] sm:text-[16px] text-white font-light'>CASUAL & EVERYDAY</h1>
                    <div className='mt-5 font-medium gap-2 text-white text-[32px] sm:text-[48px] lg:text-[70px] leading-tight' style={{fontFamily: "'Cormorant Garamond', serif"}}>
                        <h1>Effortlessly combine comfort with</h1>
                        <h1>campus style!</h1>
                    </div>
                    <div className='mt-5 flex flex-col text-white font-montserrat text-[14px] sm:text-[16px] font-light'>
                        <span>Discover our Casual & Everyday Collection at UMerch, where relaxed designs meet a refined university look.</span>
                    </div>
                    <div className='mt-10 flex justify-center lg:justify-start'>
                        <Link href="/Shop" className='bg-[#9C0306] text-white text-[16px] px-6 py-3 hover:cursor-pointer hover:bg-[#FFB600] transition-colors duration-300'>SHOP NOW</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}