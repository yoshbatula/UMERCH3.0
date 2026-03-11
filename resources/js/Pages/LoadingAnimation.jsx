import { useEffect } from 'react';
import Logo from '@images/UMERCH-LOGO.svg';

export default function LoadingAnimation() {
    useEffect(() => {
        const timer = setTimeout(() => {
            window.location.replace('/login');
        }, 3000); // Redirect after 5 seconds
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            style={{ backgroundColor: '#9C0306' }}
        >
            {/* Pulsing ring */}
            <div className="relative flex items-center justify-center">
                <span
                    className="absolute inline-flex h-40 w-40 rounded-full opacity-30 animate-ping"
                    style={{ backgroundColor: '#fff' }}
                />
                <span
                    className="absolute inline-flex h-32 w-32 rounded-full opacity-20 animate-ping"
                    style={{ backgroundColor: '#fff', animationDelay: '0.3s' }}
                />

                {/* Logo */}
                <div className="relative z-10 flex items-center justify-center bg-white rounded-full p-5 shadow-2xl">
                    <img
                        src={Logo}
                        alt="UMERCH Logo"
                        className="w-24 h-24 object-contain animate-pulse"
                    />
                </div>
            </div>

            {/* Loading dots */}
            <div className="mt-10 flex space-x-2">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-3 h-3 rounded-full bg-white animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>

            <p className="mt-4 text-white text-sm font-semibold tracking-widest uppercase opacity-80">
                Loading…
            </p>
        </div>
    );
}