import React, { useMemo, useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AddToCart from '@images/Cart.svg';
import DefaultImage from '@images/product-placeholder.svg';
import SizeChart from '@images/SizeChart.png';
import axios from 'axios';

export default function ProductCardModal({ isOpen, onClose, product, onShowToast, onCartAdded }) {
    const [quantity, setQuantity] = useState(1);
    const [showSizeChart, setShowSizeChart] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [variantStocks, setVariantStocks] = useState({});
    const page = usePage();
    const authProps = page.props?.auth;

    const variantTypesMap = {
        size: ["XS", "S", "M", "L", "XL"],
        mug: ["11ml", "13ml"],
        tumbler: ["12oz", "16oz", "20oz", "24oz"],
        notebook: ["30 pages", "50 pages", "100 pages"],
        pen: ["pen"],
        umbrella: ["umbrella"],
        keychain: ["keychain"],
        totebag: ["totebag"],
        pillow: ["pillow"],
    };

    // Fetch stock for each variant when modal opens
    useEffect(() => {
        if (isOpen && product?.product_id) {
            fetchVariantStocks();
        }
    }, [isOpen, product?.product_id]);

    const fetchVariantStocks = async () => {
        try {
            // Get available variants based on variant_type
            const variantType = product?.variant_type || 'size';
            let availableVariants = variantTypesMap[variantType] || ["1"];

            // Fetch from inventory table for accurate per-variant stock
            const res = await axios.get('/api/inventory');
            const inventoryData = res.data || [];

            // Initialize stocks with 0 for all available variants
            let stocks = {};
            availableVariants.forEach(variant => {
                stocks[variant] = 0;
            });

            // Override with actual stock values from database
            inventoryData.forEach(inv => {
                if (inv.product_id === product.product_id) {
                    stocks[inv.variant] = inv.quantity;
                }
            });
            setVariantStocks(stocks);
        } catch (error) {
            // Fallback: fetch from products table if inventory endpoint fails
            try {
                const res = await axios.get('/api/products');
                const allProducts = res.data || [];
                const variantType = product?.variant_type || 'size';
                let availableVariants = variantTypesMap[variantType] || ["1"];

                let stocks = {};
                availableVariants.forEach(variant => {
                    stocks[variant] = 0;
                });

                allProducts.forEach(p => {
                    if (p.product_name === product.product_name) {
                        stocks[p.variant] = p.product_stock;
                    }
                });
                setVariantStocks(stocks);
            } catch (fallbackError) {
                console.error('Error fetching variant stocks:', fallbackError);
            }
        }
    };

    // Set first variant when modal opens or product changes
    useEffect(() => {
        if (isOpen) {
            const variantType = product?.variant_type || 'size';
            const availableVariants = variantTypesMap[variantType] || ["1"];
            setSelectedVariant(availableVariants[0]);
        }
    }, [isOpen, product?.product_id]);

    const handleAddToCart = async () => {
        if (!product?.product_id) {
            onShowToast('Product information missing', 'error');
            return;
        }

        if (variantStocks[selectedVariant] === 0 || variantStocks[selectedVariant] === undefined) {
            onShowToast('This option is out of stock', 'error');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/add-to-cart', {
                product_id: product.product_id,
                variant: selectedVariant,
                quantity: quantity,
                price: product.product_price
            });
            onShowToast('Item added to cart successfully!', 'success');
            if (onCartAdded) onCartAdded();
            setQuantity(1);
            setTimeout(() => onClose(), 50);
        } catch (error) {
            console.error('Add to cart error:', error);
            const message = error.response?.data?.message || 'Failed to add item to cart';
            onShowToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async () => {
        // If user is not authenticated, save pending buy and redirect to login on Landing
        if (!authProps || !authProps.user) {
            try {
                const pending = {
                    product_id: product.product_id,
                    variant: selectedVariant,
                    quantity,
                    price: product.product_price,
                };
                sessionStorage.setItem('pendingBuy', JSON.stringify(pending));
            } catch (e) {}
            router.visit('/Landing?popup=1');
            return;
        }
        if (!product?.product_id) {
            onShowToast('Product information missing', 'error');
            return;
        }

        if (variantStocks[selectedVariant] === 0 || variantStocks[selectedVariant] === undefined) {
            onShowToast('This option is out of stock', 'error');
            return;
        }

        setLoading(true);
        try {
            // Add item to cart
            await axios.post('/add-to-cart', {
                product_id: product.product_id,
                variant: selectedVariant,
                quantity: quantity,
                price: product.product_price
            });

            // Get the updated cart and prepare checkout items
            const cartResponse = await axios.get('/get-cart');
            const cartItems = cartResponse.data || [];

            // Store the last item in sessionStorage for checkout
            if (cartItems.length > 0) {
                const lastItem = cartItems[cartItems.length - 1];
                sessionStorage.setItem('checkoutItems', JSON.stringify([lastItem]));
            }

            onShowToast('Item added to cart!', 'success');

            // Close the modal and navigate to checkout
            onClose();
            setTimeout(() => {
                router.visit('/Checkout');
            }, 500);
        } catch (error) {
            console.error('Buy now error:', error);
            const message = error.response?.data?.message || 'Failed to add item to cart';
            onShowToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

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

        const variantType = product?.variant_type || 'size';
        const variants = variantTypesMap[variantType] || ["1"];
        const variantLabel = variantType.charAt(0).toUpperCase() + variantType.slice(1);

        const formatPrice = (v) => `₱${Number(v || 0).toFixed(2)}`;

        return (
            <>
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
                                    <span className='text-[12px] py-3'>{variantLabel}</span>
                                    <div className='flex flex-row flex-wrap gap-y-1 px-6 items-center'>
                                        {variants.map(variant => (
                                            <button
                                                key={variant}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={`w-25 h-10 font-semibold hover:cursor-pointer transition-all ${selectedVariant === variant
                                                        ? 'bg-[#9C0306] text-white border-2 border-[#9C0306]'
                                                        : 'bg-white text-black border-2 border-[#DDDDDD] hover:border-[#9C0306]'
                                                    }`}
                                            >
                                                {variant}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {variantType === 'size' && (
                                    <div className='mt-5'>
                                        <button onClick={() => setShowSizeChart(true)} className='text-[#0058B2] hover:underline hover:cursor-pointer'>Size Chart &gt;</button>
                                    </div>
                                )}
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
                                    <span className='text-[#7F7F7F] text-[10px] font-light'>{variantStocks[selectedVariant] !== undefined ? variantStocks[selectedVariant] : 0} pieces available</span>
                                </div>
                                <div className='mt-6 flex flex-row gap-3'>
                                    <div className='absolute flex flex-row gap-3'>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={loading || variantStocks[selectedVariant] === 0}
                                            className='bg-white border border-[#9C0306] w-40 h-10 rounded-[10px] flex justify-center items-center hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            <img src={AddToCart} alt="Add to Cart" className='mr-2' />
                                            <span className='text-[#9C0306] text-[16px] font-semibold'>{loading ? 'Adding...' : 'Add to Cart'}</span>
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={loading || variantStocks[selectedVariant] === 0}
                                            className='bg-[#9C0306] w-40 h-10 rounded-[10px] flex justify-center items-center hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            <span className='text-white text-[16px] font-semibold'>{loading ? 'Processing...' : 'Buy Now'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showSizeChart && (
                    <div
                        className='fixed inset-0 z-[60] flex justify-center items-center backdrop-blur-xs bg-white/5'
                        onClick={() => setShowSizeChart(false)}
                    >
                        <div
                            className="bg-white p-4 rounded-[20px] shadow-lg relative max-w-[600px] w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={SizeChart}
                                alt="Size Chart"
                                className='w-full h-auto rounded-[10px]'
                            />
                        </div>
                    </div>
                )}
            </>
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
