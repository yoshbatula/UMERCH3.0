import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import AddToCart from '@images/Cart.svg';
import DefaultImage from '@images/product-placeholder.svg';

export default function ProductCardModal({ isOpen, onClose, product }) {
    const [quantity, setQuantity] = useState(1);
    
    if (!isOpen) return null;

    try {
        const normalize = (u) => {
            if (!u) return DefaultImage;
            const s = String(u).trim();
            if (!s) return DefaultImage;
            if (s.startsWith('http')) return s;
            if (s.startsWith('/')) return s;
            if (s.startsWith('public/storage/')) return '/' + s.replace(/^public\//, '');
            if (s.startsWith('storage/')) return '/' + s;
            return '/' + s;
        };

        const imgSrc = normalize(product?.product_image);
        const name = (product?.product_name) || 'Product';
        const description = (product?.product_description) || 'No description available.';
        const price = Number(product?.product_price || 0);
        const stock = Number(product?.product_stock || 0);
        
        let sizes = ['XS', 'S', 'M', 'L', 'XL'];
        try {
            const raw = product?.variant;
            if (typeof raw === 'string' && raw.trim()) {
                const parsed = raw.split(',').map(v => v.trim()).filter(Boolean);
                if (parsed.length > 0) {
                    sizes = parsed;
                }
            }
        } catch (e) {
            console.warn('Error parsing sizes:', e);
        }
        
        const formatPrice = (v) => `₱${Number(v || 0).toFixed(2)}`;

        return (
            <div
                className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-xs bg-white/5'
                onClick={onClose}
            >
                <div
                    className="bg-white p-2 rounded-[20px] shadow-lg relative w-210 h-115"
                    onClick={e => e.stopPropagation()}
                >
                    <div className='flex flex-row p-8 gap-5'>
                        <div className='flex items-start justify-center'>
                            <img
                                src={imgSrc}
                                alt={name}
                                className='w-[400px] h-auto rounded-[20px]'
                                onError={(e) => { e.currentTarget.src = DefaultImage; }}
                            />
                        </div>
                        <div className='flex flex-col justify-start'>
                            <div>
                                <h2 className='font-semibold text-[24px] leading-tight text-based/6 whitespace-nowrap'>{name}</h2>
                            </div>
                            <div className='mt-2 text-[12px]'>
                                {description}
                            </div>
                            <div className='mt-3 flex flex-row gap-2'>
                                <h1 className='text-[#9C0306] font-semibold text-[24px]'>{formatPrice(price)}</h1>
                            </div>
                            <div className='mt-5 flex flex-row'>
                                <span className='text-[12px] py-3'>Size</span>
                                <div className='flex flex-row flex-wrap gap-y-1 px-6 items-center'>
                                    <button className='bg-white border border-[#DDDDDD] w-18 h-10 hover:cursor-pointer'>XS</button>
                                    <button className='bg-white border border-[#DDDDDD] w-18 h-10 hover:cursor-pointer'>S</button>
                                    <button className='bg-white border border-[#DDDDDD] w-18 h-10 hover:cursor-pointer'>M</button>
                                    <button className='bg-white border border-[#DDDDDD] w-18 h-10 hover:cursor-pointer'>L</button>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <Link href="#" className='text-[#0058B2]'>Size Chart &gt;</Link>
                            </div>
                            <div className='mt-5 flex flex-row gap-4 items-center'>
                                <span className='text-[12px]'>Quantity</span>
                                <div className='flex flex-row'>
                                    <button
                                        type="button"
                                        className="w-6 h-6 flex items-center justify-center border border-[#DDDDDD] text-lg font-bold bg-white"
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    >
                                        -
                                    </button>
                                    <span className="w-13 h-6 text-center text-[#9C0306] border border-[#DDDDDD]">{quantity}</span>
                                    <button
                                        type="button"
                                        className="w-6 h-6 flex items-center justify-center border border-[#DDDDDD] text-lg font-bold bg-white"
                                        onClick={() => setQuantity(q => q + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className='text-[#7F7F7F] text-[10px] font-light'>{stock} pieces available</span>
                            </div>
                            <div className='mt-6 flex flex-row gap-3'>
                                <div className='absolute flex flex-row gap-3'>
                                    <button className='bg-white border border-[#9C0306] w-40 h-10 rounded-[10px] flex justify-center items-center hover:cursor-pointer'>
                                        <img src={AddToCart} alt="Add to Cart" className='mr-2'/>
                                        <span className='text-[#9C0306] text-[16px] font-semibold hover:cursor-pointer'>Add to Cart</span>
                                    </button>
                                    <button className='bg-[#9C0306] w-40 h-10 rounded-[10px] flex justify-center items-center hover:cursor-pointer'>
                                        <span className='text-white text-[16px] font-semibold hover:cursor-pointer'>Buy Now</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('ProductCardModal error:', error);
        return (
            <div className='fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/40' onClick={onClose}>
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    <p className='text-red-600 mb-3'>Error loading product details</p>
                    <button onClick={onClose} className='bg-[#9C0306] text-white px-4 py-2 rounded'>Close</button>
                </div>
            </div>
        );
    }
}
