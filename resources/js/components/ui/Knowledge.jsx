import React, { useState, useEffect } from 'react';
import {Link} from '@inertiajs/react';
import BackgroundImage from '@images/um5.jpg';
import LoginLogo from '@images/UMERCH-LOGIN-LOGO.svg';
import EmailIcon from '@images/email-icon.svg';
import PasswordIcon from '@images/password-icon.svg';
import {useForm} from '@inertiajs/react';

export default function Knowledge({ showLogin, onCloseLogin }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '', 
        password: '', 
        remember: false, 
    });

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setShowError(true);
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    
    const handleChange = (e) => {
        setData('remember', e.target.checked);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post('/login', {
            onSuccess: () => {
               
                if (onCloseLogin) {
                    onCloseLogin();
                }
                
            },
            onError: (errors) => {
                console.log('Login errors:', errors);
            },
            onFinish: () => {
               
            }
        });
    };

    return (
        <div className='relative min-h-screen flex flex-col'>
            {/* Background image */}
            <div className='absolute inset-0 z-0'>
                <img src={BackgroundImage} alt="UM-LOGO" className='w-full h-full object-cover'/>
                <div className='absolute inset-0 bg-black opacity-60'></div>
            </div>
            
            {/* Content */}
            <div className='relative z-10 flex items-center pl-16 min-h-screen'>
                <div className='flex flex-col'>
                    <h1 className='font-montserrat text-[16px] text-white'>CASUAL & EVERYDAY</h1>
                    <div className='mt-5 font-medium gap-2 text-white text-[70px] leading-tight' style={{fontFamily: "'Cormorant Garamond', serif"}}>
                        <h1>Effortlessly combine</h1>
                        <h1>comfort with campus style!</h1>
                    </div>
                    <div className='mt-5 flex flex-col text-white font-montserrat text-[16px] leading-tight'>
                        <span>Discover our Casual & Everyday Collection at UMerch, where relaxed designs meet a refined</span>
                        <span>university look.</span>
                    </div>
                    <div className='mt-10'>
                        <Link href="#" className='bg-[#9C0306] text-white text-[16px] px-6 py-3 hover:cursor-pointer hover:bg-[#FFB600] transition-colors duration-300'>SHOP NOW</Link>
                    </div>
                </div>
                
                {/* Login Container */}
                {showLogin && (
                    <div className='absolute right-16 top-1/2 -translate-y-1/2'>
                        <form onSubmit={handleSubmit}>
                            <div className='bg-black/60 rounded-[15px] p-8 w-96'>
                                <div className='flex flex-col justify-center items-center'>
                                    <img src={LoginLogo} alt="UMERCH Login Logo" className='w-40'/>
                                    <h1 className='text-white text-[36px] font-bold'>LOGIN</h1>
                                    
                                    {showError && Object.keys(errors).length > 0 && (
                                        <div className='p-4 py-2 bg-red-100 border border-red-400 rounded-[10px] w-full mt-3 flex justify-center items-center'>
                                            <p className="text-red-700 text-[12px]">
                                                {errors.login || errors.password || errors.email || Object.values(errors)[0]}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className='mt-6 gap-6 flex flex-col w-full'>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="login"
                                                placeholder="UM Email or UM ID"
                                                value={data.login}
                                                onChange={e => setData('login', e.target.value)}
                                                required
                                                className='bg-white/30 border rounded-[15px] h-10 w-full pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50' 
                                            />
                                            <img
                                                src={EmailIcon}
                                                alt="Email Icon"
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
                                            />
                                        </div>
                                        
                                        <div className='relative'>
                                            <input 
                                                type="password"
                                                name="password"
                                                placeholder='Password'
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                required
                                                className='bg-white/30 border rounded-[15px] h-10 w-full pl-10 pr-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50' 
                                            />
                                            <img 
                                                src={PasswordIcon} 
                                                alt="Password Icon" 
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-row items-center w-full mt-4">
                                        <input
                                            type="checkbox"
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={handleChange}
                                            className="form-checkbox w-5  text-[#9C0306] bg-white border-gray-300 rounded focus:ring-[#9C0306]"
                                        />
                                        <label htmlFor="remember" className="ml-2 text-white select-none cursor-pointer text-[14px]">
                                            Remember Me
                                        </label>
                                        <Link href="#" className="ml-auto text-white text-[14px] hover:underline">Forgot Password?</Link>
                                    </div>
                                    
                                    <div className='mt-6 w-full'>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-[#9C0306] w-full h-10 text-white text-[16px] rounded-[15px] flex items-center justify-center hover:bg-[#7a0205] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'LOGGING IN...' : 'LOGIN'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}