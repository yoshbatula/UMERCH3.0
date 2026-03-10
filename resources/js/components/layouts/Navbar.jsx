import React, { useState } from 'react';
import {Link, router} from '@inertiajs/react';
import Logo from '@images/UMERCH-LOGO.svg';
import { usePage } from '@inertiajs/react';
export default function Navbar({ onSignInClick }) {

    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (href) => {
        if (href === '/login') return url === '/login';
        if (href === '/Products') return url === '/Products';
        return url.startsWith(href);
    };

    return (
        <div className="bg-[#9C0306] sticky top-0 z-50">
            {/* Main bar */}
            <div className="flex flex-row items-center px-4 sm:px-6 h-16 sm:h-20">
                <img src={Logo} alt="UMERCH LOGO" className="h-8 sm:h-10 w-auto" />

                {/* Desktop nav links */}
                <div className='hidden md:flex flex-row gap-6 px-8 text-white font-montserrat'>
                    <Link href="/login" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/login') ? 'text-[#FFB600]' : ''}`}>HOME</Link>
                    <Link href="/Products" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/Products') ? 'text-[#FFB600]' : ''}`}>PRODUCTS</Link>
                    <Link href="/AboutUs" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/AboutUs') ? 'text-[#FFB600]' : ''}`}>ABOUT US</Link>
                    <a
                        href="#footer"
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className='font-bold text-[16px] leading-tight cursor-pointer'
                    >CONTACT US</a>
                </div>

                {/* Desktop sign in */}
                <div className='hidden md:flex flex-row gap-4 font-bold ml-auto text-white font-montserrat'>
                    <button
                        className='font-bold text-[16px] leading-tight bg-transparent border-none cursor-pointer'
                        onClick={onSignInClick ? onSignInClick : () => router.visit('/Landing?popup=1')}
                    >SIGN IN</button>
                </div>

                {/* Mobile: sign in + hamburger */}
                <div className='flex md:hidden ml-auto items-center gap-3'>
                    <button
                        className='font-bold text-[14px] text-white bg-transparent border-none cursor-pointer'
                        onClick={onSignInClick ? onSignInClick : () => router.visit('/Landing?popup=1')}
                    >SIGN IN</button>
                    <button
                        className='text-white focus:outline-none'
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className='md:hidden flex flex-col bg-[#7a0205] text-white font-montserrat font-bold text-[15px]'>
                    <Link href="/login" prefetch className={`px-6 py-3 border-b border-[#9C0306] ${isActive('/login') ? 'text-[#FFB600]' : ''}`} onClick={() => setMobileOpen(false)}>HOME</Link>
                    <Link href="/Products" prefetch className={`px-6 py-3 border-b border-[#9C0306] ${isActive('/Products') ? 'text-[#FFB600]' : ''}`} onClick={() => setMobileOpen(false)}>PRODUCTS</Link>
                    <Link href="/AboutUs" prefetch className={`px-6 py-3 border-b border-[#9C0306] ${isActive('/AboutUs') ? 'text-[#FFB600]' : ''}`} onClick={() => setMobileOpen(false)}>ABOUT US</Link>
                    <a
                        href="#footer"
                        className='px-6 py-3 cursor-pointer'
                        onClick={(e) => {
                            e.preventDefault();
                            setMobileOpen(false);
                            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >CONTACT US</a>
                </div>
            )}
        </div>
    );
}