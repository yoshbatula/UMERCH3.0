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
        <div>
            
        </div>
    );
}