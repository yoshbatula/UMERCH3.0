import React, {Suspense, lazy, useEffect} from 'react';
import {Link, usePage} from '@inertiajs/react';
import Navbar from '../components/layouts/Navbar';

// Lazy load components
const Hero = lazy(() => import('../components/ui/Hero'));
const FeatureSection = lazy(() => import('../components/ui/FeatureSection'));
const Accessories = lazy(() => import('../components/ui/Accessories'));
const LimitedOffer = lazy(() => import('../components/ui/LimitedOffer'));
const FeatureProducts = lazy(() => import('../components/ui/FeatureProducts'));
const DiscountedProduct = lazy(() => import('../components/ui/DiscountedProduct'));
const Advertisement = lazy(() => import('../components/ui/Advertisement'));
const Knowledge = lazy(() => import('../components/ui/Knowledge'));
const Footer = lazy(() => import('../components/layouts/Footer'));

export default function Login() {
    const { auth } = usePage().props;

    // Redirect already authenticated users
    useEffect(() => {
        if (auth?.user) {
            if (auth.user.role === 'Admin') {
                window.location.replace('/admin');
            } else {
                window.location.replace('/Landing');
            }
        }
    }, [auth?.user]);

    const [showLogin, setShowLogin] = React.useState(false);
    React.useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('popup')) {
                setShowLogin(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch {}
    }, []);

    const handleSignInClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setShowLogin(true);
    };

    
    return (
        <>
        {/* merging  */}
            <div>
                {/* Navigation components */}
                <Navbar onSignInClick={handleSignInClick} />
                {/*  */}
                <Suspense fallback={<div>Loading...</div>}>
                    <Knowledge showLogin={showLogin} onCloseLogin={() => setShowLogin(false)} />
                    <Advertisement />
                    <DiscountedProduct />
                    <FeatureProducts />
                    <Accessories />
                    <LimitedOffer />
                    <FeatureSection />
                    <Hero />
                </Suspense>
                <Footer />
            </div>
        </>
    );
}   

