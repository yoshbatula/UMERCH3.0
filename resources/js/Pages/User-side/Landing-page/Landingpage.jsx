import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/layouts/LandingNav'
import KnowledgeSection from './Knowledge';
import LoginModal from '../../../components/ui/Knowledge';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import Advertisement from '../../../components/ui/Advertisement';
import DiscountedProdcuts from "../../../components/ui/DiscountedProduct";
import FeaturedProducts from './FeaturedProducts';
import LimitedOffer from '../../../components/ui/LimitedOffer';
import Accessories from './Accessories';
import FeatureSection from '../../../components/ui/FeatureSection';
import Hero from '../../../components/ui/Hero';
import Footer from '../../../components/layouts/Footer';
export default function Landingpage() {
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('popup')) {
                setShowLogin(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch {}
    }, []);

    // If there's a pending buy (from clicking Buy Now while unauthenticated), attempt to add to cart and go to checkout
    useEffect(() => {
        const tryProcessPendingBuy = async () => {
            try {
                const pendingRaw = sessionStorage.getItem('pendingBuy');
                if (!pendingRaw) return;
                const pending = JSON.parse(pendingRaw);
                // ensure user is authenticated
                const page = usePage();
                const auth = page.props?.auth;
                if (!auth || !auth.user) return;

                // attempt add to cart
                await axios.post('/add-to-cart', pending);
                sessionStorage.removeItem('pendingBuy');
                router.visit('/Checkout');
            } catch (e) {
                // leave pendingBuy for retry or show error elsewhere
                console.error('Failed to process pending buy', e);
            }
        };

        tryProcessPendingBuy();
    }, []);

    return (
        <>
            {/* Navigation component */}
            <Navbar/>

            {/* Login modal (appears when ?popup=1 is present) */}
            <LoginModal showLogin={showLogin} onCloseLogin={() => setShowLogin(false)} />

            {/* Knowledge component */}
            <KnowledgeSection />

            {/* Advertisement component */}
            <Advertisement/>

            {/* DiscountedProducts component */}
            <DiscountedProdcuts />

            {/* FeaturedProducts component */}
            <FeaturedProducts />

            {/* Limited Offer component */}
            <LimitedOffer />

            {/* Accessories component */}
            <Accessories />

            {/* FeatureSection component */}
            <FeatureSection />

            {/* Hero component */}
            <Hero/>

            {/* Footer component */}
            <Footer />
        </>
    );
}