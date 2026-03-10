import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import Logo from '@images/UMERCH-LOGO.svg';
import CartIcon from '@images/CartIcon.svg';
import NotificationIcon from '@images/NotificationIcon.svg';
import UserAvatar from '@images/AccountIcon.svg'
import LogoutModal from '@/components/modals/LogoutModal';
import RedUserAvatar from '@images/red-account-logo.svg';
export default function LandingNav({ cartCount = 0 }) {
    const page = usePage();
    const url = page.url;
    const auth = page.props.auth;
    const userName = auth?.user?.name || 'User';
    const { post } = useForm();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    
    const isActive = (href) => {
        if (!url) return false;
        if (url === href) return true;
        if (url.startsWith(href) && href !== '/') return true;
        return false;
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
        setIsDropdownOpen(false);
    };

   
    return (
        <>
            <div className="bg-[#9C0306] sticky top-0 z-50">
                {/* Main bar */}
                <div className="flex flex-row items-center px-4 sm:px-6 h-16 sm:h-20">
                    <img src={Logo} alt="UMERCH LOGO" className="h-8 sm:h-10 w-auto" />

                    {/* Desktop nav links */}
                    <div className='hidden md:flex flex-row gap-6 px-8 text-white font-montserrat'>
                        <Link href="/Landing" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/Landing') ? 'text-[#FFB600]' : ''}`}>HOME</Link>
                        <Link href="/Shop" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/Shop') ? 'text-[#FFB600]' : ''}`}>SHOP</Link>
                        <Link href="/Orders" prefetch className={`font-bold text-[16px] leading-tight ${isActive('/Orders') ? 'text-[#FFB600]' : ''}`}>ORDERS</Link>
                    </div>

                    {/* Desktop right icons */}
                    <div className='hidden md:flex flex-row gap-x-7 items-center font-bold ml-auto text-white font-montserrat'>
                        <Link href="/Cart" prefetch className="relative">
                            <img src={CartIcon} alt="Cart Icon"/>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB600] text-[#9C0306] text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
                        <div className='flex flex-row gap-1 items-center relative'>
                            <Link href="#"><img src={UserAvatar} alt="User Avatar"/></Link>
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className='bg-[#9C0306] text-white hover:text-[#FFB600] cursor-pointer font-semibold'
                            >
                                {userName}
                            </button>
                            {isDropdownOpen && (
                                <div className='absolute top-full mt-2 bg-white border border-[#E0E0E0] rounded-lg w-48 right-0 shadow-lg z-40'>
                                    <div className='px-4 py-3 flex flex-row gap-1 items-center border-b border-[#E0E0E0]'>
                                        <img src={RedUserAvatar} alt="User Avatar" className='w-7 h-7'/>
                                        <div className='flex flex-col'>
                                            <p className='text-[16px] text-[#9C0306] font-bold'>{userName}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className='w-full text-left px-4 py-3 text-[#9C0306] hover:bg-[#F5F5F5] transition flex flex-row gap-2 items-center font-semibold text-sm'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile: cart + hamburger */}
                    <div className='flex md:hidden ml-auto items-center gap-4'>
                        <Link href="/Cart" prefetch className="relative">
                            <img src={CartIcon} alt="Cart Icon" className="w-6 h-6"/>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#FFB600] text-[#9C0306] text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </Link>
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
                        <Link href="/Landing" prefetch className={`px-6 py-3 border-b border-[#9C0306] ${isActive('/Landing') ? 'text-[#FFB600]' : ''}`} onClick={() => setMobileOpen(false)}>HOME</Link>
                        <Link href="/Shop" prefetch className={`px-6 py-3 border-b border-[#9C0306] ${isActive('/Shop') ? 'text-[#FFB600]' : ''}`} onClick={() => setMobileOpen(false)}>SHOP</Link>
                        <Link href="/Orders" prefetch className={`px-6 py-3 border-b border-[#9C0306] ${isActive('/Orders') ? 'text-[#FFB600]' : ''}`} onClick={() => setMobileOpen(false)}>ORDERS</Link>
                        <button
                            onClick={() => { setIsDropdownOpen(!isDropdownOpen); }}
                            className='px-6 py-3 text-left flex items-center gap-2'
                        >
                            <img src={UserAvatar} alt="User Avatar" className='w-5 h-5'/>
                            {userName}
                        </button>
                        {isDropdownOpen && (
                            <button
                                onClick={handleLogout}
                                className='px-8 py-3 text-left text-[#FFB600] font-semibold text-sm border-t border-[#9C0306]'
                            >Logout</button>
                        )}
                    </div>
                )}
            </div>
            <LogoutModal 
                open={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
            />
        </>
    );
}