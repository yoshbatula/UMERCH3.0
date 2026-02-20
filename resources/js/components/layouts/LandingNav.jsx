import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import Logo from '@images/UMERCH-LOGO.svg';
import CartIcon from '@images/CartIcon.svg';
import NotificationIcon from '@images/NotificationIcon.svg';
import UserAvatar from '@images/AccountIcon.svg'
import LogoutModal from '@/components/modals/LogoutModal';
import RedUserAvatar from '@images/red-account-logo.svg';
export default function LandingNav() {
    const page = usePage();
    const url = page.url;
    const auth = page.props.auth;
    const userName = auth?.user?.name || 'User';
    const { post } = useForm();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    
    const isActive = (href) => {
        if (!url) return false;
        // Direct exact match comparison
        if (url === href) return true;
        // Check if url starts with the href
        if (url.startsWith(href) && href !== '/') return true;
        return false;
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
        setIsDropdownOpen(false);
    };

    // done adding the logout
    return (
        <>
            <div className="bg-[#9C0306] flex flex-row items-center p-6 h-20 sticky top-0 z-50">
                <img src={Logo} alt="UMERCH LOGO" />
                <div className='flex flex-row gap-6 p-8 text-white font-montserrat'>
                    <Link
                        href="/Landing"
                        prefetch
                        className={`font-bold text-[16px] leading-tight ${isActive('/Landing') ? 'text-[#FFB600]' : ''}`}
                    >HOME</Link>
                    <Link
                        href="/Shop"
                        prefetch
                        className={`font-bold text-[16px] leading-tight ${isActive('/Shop') ? 'text-[#FFB600]' : ''}`}
                    >SHOP</Link>
                    <Link
                        href="/Orders"
                        className={`font-bold text-[16px] leading-tight ${isActive('/Orders') ? 'text-[#FFB600]' : ''}`}
                        prefetch
                        >ORDERS</Link>
                </div>
                <div className='flex flex-row gap-x-7 items-center font-bold ml-auto text-white font-montserrat'>
                    <Link href="/Cart" prefetch><img src={CartIcon} alt="Cart Icon"/></Link>
                    <Link href="#"><img src={NotificationIcon} alt="Notification Icon"/></Link>
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
                                {/* User Profile Section */}
                                <div className='px-4 py-3 flex flex-row gap-1 items-center border-b border-[#E0E0E0]'>
                                    <img src={RedUserAvatar} alt="User Avatar" className='w-7 h-7'/>
                                    <div className='flex flex-col'>
                                        <p className='text-[16px] text-[#9C0306] font-bold'>{userName}</p>
                                    </div>
                                </div>
                                
                                {/* Logout Button */}
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
            </div>
            <LogoutModal 
                open={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
            />
        </>
    );
}