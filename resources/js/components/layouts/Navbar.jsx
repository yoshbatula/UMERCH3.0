import React from 'react';
import {Link, router} from '@inertiajs/react';
import Logo from '@images/UMERCH-LOGO.svg';
import { usePage } from '@inertiajs/react';
import UMLOGO from '@images/UM-LOGO.png';
export default function Navbar({ onSignInClick }) {

    const { url } = usePage();
    const isActive = (href) => {
        if (href === '/login') return url === '/login';
        if (href === '/Products') return url === '/Products';
        return url.startsWith(href);
    };

    return (
        <div className="bg-[#9C0306] flex flex-row items-center p-6 h-20 sticky top-0 z-50">
            {/* <img src={UMLOGO} alt="UM-LOGO" className='w-20'/> */}
            <img src={Logo} alt="UMERCH LOGO" />
            <div className='flex flex-row gap-6 p-8 text-white font-montserrat'>
                <Link href="/login" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/login') ? 'text-[#FFB600]' : ''}`}>HOME</Link>
                <Link href="/Products" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/Products') ? 'text-[#FFB600]' : ''}`} >PRODUCTS</Link>
                <Link href="/AboutUs" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/AboutUs') ? 'text-[#FFB600]' : ''}`} >ABOUT US</Link>
                <a
                    href="#footer"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className='font-bold text-[16px] leading-tight cursor-pointer'
                >CONTACT US</a>
            </div>
            <div className='flex flex-row gap-4 font-bold ml-auto text-white font-montserrat'>
                <button
                    className='font-bold text-[16px] leading-tight bg-transparent border-none cursor-pointer'
                    onClick={onSignInClick ? onSignInClick : () => router.visit('/Landing?popup=1')}
                >SIGN IN</button>
            </div>
        </div>
    );
}