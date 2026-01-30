import React, {useEffect, useState} from 'react';
import Navbar from '../../../components/layouts/LandingNav';
import BackgroundModel from '@images/BackgroundModel.png'; 
import ShopCards from '../../../components/cards/ProductCards';
import Footer from '../../../components/layouts/Footer';
import LeftArrow from '@images/LeftArrow.svg';
import RightArrow from '@images/RightArrow.svg';
import ProductCardModal from '../../../components/modals/ProductCardModal';
import AccessoriesCardModal from '../../../components/modals/ProductAccessoriesModal';
import axios from 'axios';
export default function Shop() {

    const [ProductModalOpen, setProductModalOpen] = useState(false);
    const [AccessoriesModalOpen, setAccessoriesModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 6000);
    };

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

    const openProductModal = (product) => {
        setSelectedProduct(product || null);
        setProductModalOpen(true);
    }

    const closeProductModal = () => {
        setProductModalOpen(false);
        setSelectedProduct(null);
    }

    const openAccessoriesModal = () => {
        setAccessoriesModalOpen(true);
    }

    const closeAccessoriesModal = () => {
        setAccessoriesModalOpen(false);
    }

    useEffect(() => {
        axios.get('/admin/products')
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : [];
                const grouped = groupProductsByName(list);
                setProducts(grouped);
            })
            .catch(() => setProducts([]));
    }, []);

    return (
        <>
            <Navbar/>
            <div className='bg-[#F6F6F6] flex flex-col justify-center'>
            <div className='w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden'>
                <img 
                src={BackgroundModel}
                alt="Background Model"
                className='w-full h-full object-cover'
                />
            </div>

            {/* Filters */}
            <div className='py-15 flex flex-row text-center justify-between text-[#727272] gap-5 px-20'>
                <div className='flex flex-row gap-5'>
                    <div className='flex flex-row gap-1 items-center'>
                        <p>View</p>
                        <select className='border border-[#727272] rounded px-2 py-1'>
                            <option value="grid">25</option>
                        </select>
                    </div>
                    <div className='flex flex-row gap-1 items-center'>
                        <p>Sort by</p>
                        <select className='border border-[#727272] rounded px-2 py-1'>
                            <option value="default">Default</option>
                        </select>
                    </div>
                </div>
                <div className='flex flex-row gap-1 items-center'>
                    <p>Showing 1-20 of 120 results </p>
                </div>
            </div>

            {/* Shop cards */}
            <div className='flex flex-row flex-wrap justify-center gap-6 px-10 pb-10'>
                {products.map(p => (
                    <ShopCards
                        key={p.product_id}
                        onClick={() => openProductModal(p)}
                        image={p.product_image}
                        name={p.product_name}
                        description={p.product_description}
                        price={p.product_price}
                        stock={p.product_stock}
                    />
                ))}
            </div>

            {/* Pagination */}
            <div className='flex flex-row justify-center items-center gap-4 pb-10'>
                <button className='px-3 py-1 hover:cursor-pointer'><img src={LeftArrow} alt="Left Arrow"/></button>
                <button className='px-3 py-1 border border-gray-400 rounded bg-[#9C0306] text-white hover:cursor-pointer'>1</button>
                <button className='px-3 py-1 border border-[#9C0306] text-[#9C0306] hover:cursor-pointer'>2</button>
                <button className='px-3 py-1 border border-[#9C0306] text-[#9C0306] hover:cursor-pointer'>3</button>
                <button className='px-3 py-1 hover:cursor-pointer'><img src={RightArrow} alt="Right Arrow"/></button>
            </div>

            {/* Footer */}
            <Footer />

            {/* Modals */}
            <ProductCardModal isOpen={ProductModalOpen} onClose={closeProductModal} product={selectedProduct} onShowToast={showToast}/>
            <AccessoriesCardModal isOpen={AccessoriesModalOpen} onClose={closeAccessoriesModal}/>

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-[70] animate-pulse ${
                        toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {toast.message}
                </div>
            )}

            
        </div>
        </>
    );
}