import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../cards/ProductCards';
import Placeholder from '@images/product-placeholder.svg';

export default function FeatureProducts() {
    const [items, setItems] = useState([]);
    const API = '/admin/products';

    const normalizeImageUrl = (u) => {
        if (!u) return Placeholder;
        const s = String(u).trim();
        if (!s) return Placeholder;
        if (s.startsWith('http')) return s;
        if (s.startsWith('/')) return s;
        if (s.startsWith('public/storage/')) return '/' + s.replace(/^public\//, '');
        if (s.startsWith('storage/')) return '/' + s;
        return '/' + s;
    };

    useEffect(() => {
        axios.get(API)
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                setItems(list.slice(0, 4));
            })
            .catch(() => setItems([]));
    }, []);

    return (
        <div className="bg-[#F6F6F6] mt-20">
            <div className="flex flex-col justify-center items-center py-15">
                <h1 className="font-bold text-[42px]">Feature Products</h1>
                <div className="mx-auto w-52 h-1 bg-[#FFB600]" />
            </div>
            {/* Feature Cards */}
            <div className='flex flex-row flex-wrap justify-center gap-6'>
                {items.map((p) => (
                    <ProductCard
                        key={p.product_id}
                        image={normalizeImageUrl(p.product_image)}
                        name={p.product_name}
                        description={p.product_description}
                        price={p.product_price}
                        stock={p.product_stock}
                    />
                ))}
            </div>
            <div className='mt-8 flex justify-center items-center'>
                <div className='bg-[#9C0306] w-55 h-10 rounded-[20px] flex justify-center items-center hover:cursor-pointer'>
                    <button className='text-white text-[16px] font-semibold hover:cursor-pointer'>SEE MORE PRODUCTS</button>
                </div>
            </div>
        </div>
    );
}