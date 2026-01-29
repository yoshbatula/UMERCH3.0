import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Logo from '@images/UMERCH-LOGO.svg';
import CartIcon from '@images/CartIcon.svg';
import NotificationIcon from '@images/NotificationIcon.svg';
import UserAvatar from '@images/AccountIcon.svg'

export default function LandingNav() {
    const page = usePage();
    const url = page.url;
    const auth = page.props.auth;
    const userName = auth?.user?.name || 'User';
    
    const isActive = (href) => {
        if (!url) return false;
        // Direct exact match comparison
        if (url === href) return true;
        // Check if url starts with the href
        if (url.startsWith(href) && href !== '/') return true;
        return false;
    };
    
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
                    <div className='flex flex-row gap-1 items-center'>
                        <Link href="#"><img src={UserAvatar} alt="User Avatar"/></Link>
                        <span className='text-[16px] font-bold'>Hi, {userName}</span>
                        <select name="user-options" id="user-options">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}