import React from 'react';
import {Link} from '@inertiajs/react';
import BackgroundImage from '@images/um5.jpg';
import LoginLogo from '@images/UMERCH-LOGIN-LOGO.svg';
import EmailIcon from '@images/email-icon.svg';
import PasswordIcon from '@images/password-icon.svg';
export default function Knowledge({ showLogin, onCloseLogin }) {
    return (
        <div className='flex flex-col justify-center items-center text-center'>
            {/* Background image */}
            <div className='relative z-0'>
                <img src={BackgroundImage} alt="UM-LOGO" className='w-full h-full object-cover'/>
                <div className='absolute inset-0 bg-black opacity-60'></div>
            </div>
            {/* Content */}
            <div className='absolute flex items-center pl-16 z-10'>
                <div className='flex flex-col mt-10'>
                    <h1 className='text-[16px] text-white font-light'>CASUAL & EVERYDAY</h1>
                    <div className='mt-5 font-medium gap-2 text-white font-CormorantGaramond text-[48px] text-[70px] leading-tight' style={{fontFamily: "'Cormorant Garamond', serif"}}>
                        <h1>Effortlessly combine comfort with</h1>
                        <h1>campus style!</h1>
                    </div>
                    <div className='mt-5 flex flex-col text-white font-montserrat text-[16px] font-light'>
                        <span>Discover our Casual & Everyday Collection at UMerch, where relaxed designs meet a refined university look.</span>
                    </div>
                    <div className='mt-10'>
                        <Link href="#" className='bg-[#9C0306] text-black text-white text-[16px] px-6 py-3 hover:cursor-pointer hover:bg-[#FFB600] transition-colors duration-300'>SHOP NOW</Link>
                    </div>
                </div>
                
            </div>
        </div>
    );
}