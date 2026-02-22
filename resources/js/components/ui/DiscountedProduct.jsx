import React, { useState } from 'react';
import DiscountedProducts from '@images/um2.jpg';
import DiscountedProducts1 from '@images/um3.jpg';
import UMESTE from '@images/UMESTE.png'
import { Link } from '@inertiajs/react';
export default function DiscountedProduct() {
    const Images = [
        DiscountedProducts,
        DiscountedProducts1,
    ];
        const [current, setCurrent] = useState(0);
        const startXRef = React.useRef(null);
        const draggingRef = React.useRef(false);

        React.useEffect(() => {
            const interval = setInterval(() => {
                setCurrent(prev => (prev + 1) % Images.length);
            }, 5000);
            return () => clearInterval(interval);
        }, [Images.length]);

    const handleTouchStart = (e) => {
        startXRef.current = e.touches[0].clientX;
        draggingRef.current = true;
    };
    const handleTouchEnd = (e) => {
        if (!draggingRef.current) return;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startXRef.current;
        if (Math.abs(diff) > 50) {
            if (diff < 0) {
                setCurrent((current + 1) % Images.length);
            } else {
                setCurrent((current - 1 + Images.length) % Images.length);
            }
        }
        draggingRef.current = false;
    };
    const handleMouseDown = (e) => {
        startXRef.current = e.clientX;
        draggingRef.current = true;
    };
    const handleMouseUp = (e) => {
        if (!draggingRef.current) return;
        const endX = e.clientX;
        const diff = endX - startXRef.current;
        if (Math.abs(diff) > 50) {
            if (diff < 0) {
                setCurrent((current + 1) % Images.length);
            } else {
                setCurrent((current - 1 + Images.length) % Images.length);
            }
        }
        draggingRef.current = false;
    };
    return (
        <div className='flex flex-col justify-center items-center'>
            <img src={UMESTE} alt="UMESTE"  className='w-auto h-150'/>
            <div className='absolute items-center justify-center'>
                <div className='relative transform translate-y-[250px]'>
                    <div className='flex flex-row justify-center items-center'>
                        <div className='bg-[#C3C3C3] border border-[#C3C3C3] w-10 h-3 rounded-2xl hover:bg-[#9C0306] hover: transition-colors duration-200'></div>
                        <div>yosh</div>
                    </div>
                </div>
            </div>
        </div>
    );
}