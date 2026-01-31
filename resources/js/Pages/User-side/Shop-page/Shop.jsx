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
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('default');
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);

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

    // Filter products based on search query
    const filteredProducts = products.filter(p => 
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.product_description && p.product_description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.product_price - b.product_price;
        if (sortBy === 'price-high') return b.product_price - a.product_price;
        if (sortBy === 'name') return a.product_name.localeCompare(b.product_name);
        return 0;
    });

    // Pagination
    const totalItems = sortedProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

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
                        <select className='border border-[#727272] rounded px-2 py-1' value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value="9">9</option>
                            <option value="15">15</option>
                            <option value="25">25</option>
                        </select>
                    </div>
                    <div className='flex flex-row gap-1 items-center'>
                        <p>Sort by</p>
                        <select className='border border-[#727272] rounded px-2 py-1' value={sortBy} onChange={handleSortChange}>
                            <option value="default">Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A to Z</option>
                        </select>
                    </div>
                    <div className='flex flex-row items-center gap-2 border border-[#727272] rounded px-2 py-1'>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M21 21l-4.35-4.35"
                                stroke="#727272"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M11 19a8 8 0 100-16 8 8 0 000 16z"
                                stroke="#727272"
                                strokeWidth="2"
                            />
                        </svg>
                        <input type="text" placeholder="Search products..." className="border-none outline-none bg-transparent w-full text-sm text-gray-700 placeholder:text-gray-400" value={searchQuery} onChange={handleSearchChange} />
                    </div>
                </div>
                <div className='flex flex-row gap-1 items-center'>
                    <p>Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems} results </p>
                </div>
            </div>

            {/* Shop cards */}
            <div className='flex flex-row flex-wrap justify-center gap-6 px-10 pb-10'>
                {paginatedProducts.map(p => (
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
                <button 
                    onClick={() => goToPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className='px-3 py-1 hover:cursor-pointer disabled:opacity-50'
                >
                    <img src={LeftArrow} alt="Left Arrow"/>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button 
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 border rounded hover:cursor-pointer ${
                            page === currentPage 
                                ? 'bg-[#9C0306] text-white border-gray-400' 
                                : 'border-[#9C0306] text-[#9C0306]'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                <button 
                    onClick={() => goToPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className='px-3 py-1 hover:cursor-pointer disabled:opacity-50'
                >
                    <img src={RightArrow} alt="Right Arrow"/>
                </button>
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