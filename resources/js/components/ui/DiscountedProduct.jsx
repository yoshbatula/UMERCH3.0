import React, { useState } from 'react';
import DiscountedProducts from '@images/um2.jpg';
import DiscountedProducts1 from '@images/um3.jpg';
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
        <div className='mt-5 flex flex-row justify-center items-center gap-10'>
            <div className='relative flex flex-col items-center'>
                <img
                    src={Images[current]}
                    alt="Discounted Product"
                    className='w-100 h-100 rounded-2xl'
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    draggable={false}
                    style={{ userSelect: 'none', cursor: 'grab' }}
                />
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
                    {Images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1 w-8 transition-all duration-300 ${current === idx ? 'bg-[#9C0306]' : 'bg-gray-300'} rounded-full border-none focus:outline-none`}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
            <div className='flex flex-col text-black gap-2 text-start'>
                <h1 className='font-bold text-[36px]'>Discounted Products</h1>
                <p className='text-[16px]'>Get the best deals on our top-quality products!</p>
                <p className='text-[16px]'>Enjoy exclusive discounts and save big on your favorite items.</p>
                <p className='text-[16px]'> Don't miss out on these limited-time offers - shop now!</p>
                <Link href="#" className='bg-[#9C0306] text-black text-white text-[16px] px-6 py-3 hover:cursor-pointer hover:bg-[#FFB600] transition-colors duration-300 w-40 text-center mt-4'>SHOP NOW</Link>
            </div>
        </div>
    );
}