import React from 'react';
import {Link} from '@inertiajs/react';
import Navbar from '../components/layouts/Navbar';
import Knowledge from '../components/ui/Knowledge';
import Advertisement from '../components/ui/Advertisement';
import DiscountedProduct from '../components/ui/DiscountedProduct';
import FeatureProducts from '../components/ui/FeatureProducts';
import LimitedOffer from '../components/ui/LimitedOffer';
import Accessories from '../components/ui/Accessories';
import FeatureSection from '../components/ui/FeatureSection'
import Hero from '../components/ui/Hero';
import Footer from '../components/layouts/Footer';
export default function Login() {

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
            <div>
                {/* Navigation components */}
                <Navbar onSignInClick={handleSignInClick}/>

                {/* Knowledge components*/}
                <Knowledge showLogin={showLogin} onCloseLogin={() => setShowLogin(false)} />

                {/* Advertisement components*/}
                <Advertisement/>

                {/* Discounted Product components*/}
                <DiscountedProduct/>

                {/* Featured Products components */}
                <FeatureProducts/>

                {/* Limited Offer components */}
                <LimitedOffer/>

                {/* UM Accessories components */}
                <Accessories/>

                {/* Feature Section components */}
                <FeatureSection/>

                {/* Hero components */}
                <Hero/>

                {/* Footer components */}
                <Footer onSmoothClick={handleSignInClick}/>
            </div>
        </>
    );
}   

