import { Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function CartsNav() {
    const { url } = usePage();
    const isActive = (href) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };
    return (
        <div className='flex flex-row justify-center items-center gap-3'>
            <div className={`bg-white flex items-center justify-center w-130 h-20 ${isActive('/Cart') ? 'border border-[#9C0306] text-[#9C0306]' : ''}`}>
                <Link href="/Cart" prefetch className={`text-[24px] font-bold ${isActive('/Cart') ? 'text-[#9C0306]' : ''}`}>01 Cart</Link>
            </div>
            <div className={`bg-white flex items-center justify-center w-130 h-20 ${isActive('/Checkout') ? 'border border-[#9C0306] text-[#9C0306]' : ''}`}>
                <Link href="/Checkout" prefetch className={`text-[24px] font-bold ${isActive('/Checkout') ? 'text-[#9C0306]' : ''}`}>02 Checkout</Link>
            </div>
        </div>
    );
}