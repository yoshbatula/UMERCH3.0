import React from 'react';
import DefaultImage from '@images/product-placeholder.svg';

export default function ProductCard({
    onClick,
    image,
    name,
    description,
    price,
    stock
}) {
    const normalize = (u) => {
        if (!u) return DefaultImage;
        const s = String(u).trim();
        if (!s) return DefaultImage;
        if (s.startsWith('http')) return s;
        if (s.startsWith('/')) return s;
        if (s.startsWith('storage/')) return '/' + s;
        if (s.startsWith('public/storage/')) return '/' + s.replace(/^public\//, '');
        return '/' + s;
    };
    const imgSrc = normalize(image);
    const formatPrice = (v) => {
        if (v === undefined || v === null || v === '') return '₱0.00';
        const num = Number(v);
        if (Number.isNaN(num)) return '₱0.00';
        return `₱${num.toFixed(2)}`;
    };
    return (
        <div>
            <div
                className="bg-white shadow-md rounded-[20px]  w-80 hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
                onClick={onClick}
            >
                <div className='w-full h-64 overflow-hidden rounded-t-[20px]'>
                    <img
                        src={imgSrc}
                        alt={name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = DefaultImage; }}
                    />
                </div>
                <div className="mt-4 p-3 flex flex-col">
                    <div>
                        <h2 className="font-bold text-lg mb-2">{name || 'Product Name'}</h2>
                        <p className="text-gray-600 mb-2 truncate">{description || 'No description available'}</p>
                    </div>
                    <div className='flex flex-row gap-2 justify-between items-center w-full'>
                        <div className='flex gap-2'>
                            <p className='font-semibold text-[18px] text-[#9C0306]'>{formatPrice(price)}</p>
                        </div>
                        <span className='text-[10px] p-2'>{(stock ?? 0)} stocks left</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
