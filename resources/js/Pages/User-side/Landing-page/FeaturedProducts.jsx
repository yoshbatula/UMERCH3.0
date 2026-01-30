import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../../components/cards/ProductCards';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);

    // Group products by name and show only one per group
    const groupProductsByName = (productList) => {
        const grouped = {};
        productList.forEach((product) => {
            if (!grouped[product.product_name]) {
                grouped[product.product_name] = product;
            }
        });
        return Object.values(grouped);
    };

    useEffect(() => {
        axios.get('/admin/products')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                const grouped = groupProductsByName(list);
                setProducts(grouped.slice(0, 4));
            })
            .catch(() => setProducts([]));
    }, []);

    return (
        <div className="bg-[#F6F6F6] mt-20">
            <div className="flex flex-col justify-center items-center py-15">
                <h1 className="font-bold text-[42px]">Feature Products</h1>
                <div className="mx-auto w-52 h-1 bg-[#FFB600]" />
            </div>
            {/* Feature Cards */}
            <div className='flex flex-row flex-wrap justify-center gap-6'>
                {products.map(p => (
                    <ProductCard
                        key={p.product_id}
                        image={p.product_image}
                        name={p.product_name}
                        description={p.product_description}
                        price={p.product_price}
                        stock={p.product_stock}
                    />
                ))}
            </div>
        </div>
    );
}