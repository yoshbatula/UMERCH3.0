import React, { useRef, useState, useEffect } from "react";
import { usePage, router } from '@inertiajs/react';

export default function Authentication({ email }) {
    const inputLength = 6;
    const [values, setValues] = useState(Array(inputLength).fill(""));
    const inputsRef = useRef([]);
    const [cooldown, setCooldown] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [expiredError, setExpiredError] = useState(false);
    const [otpError, setOtpError] = useState('');
    const page = usePage();
    const { errors } = page.props;
    
    // Debug log to see what's in props
    console.log('Page props:', page.props);
    console.log('Errors object:', errors);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    // Watch for OTP errors from server
    useEffect(() => {
        if (errors.otp) {
            const errorMessage = Array.isArray(errors.otp) ? errors.otp[0] : errors.otp;
            setOtpError(errorMessage);
            console.log('Error from props:', errorMessage);
            
            if (errorMessage.toLowerCase().includes('expired')) {
                setExpiredError(true);
            } else {
                setExpiredError(false);
            }
        } else {
            setOtpError('');
            setExpiredError(false);
        }
    }, [errors.otp]);

    // Clear error message after 6 seconds
    useEffect(() => {
        if (otpError) {
            const timer = setTimeout(() => {
                setOtpError('');
                setExpiredError(false);
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [otpError]);

    const handleChange = (e, idx) => {
        const val = e.target.value.replace(/[^0-9]/g, "");
        if (!val) {
            setValues((prev) => {
                const arr = [...prev];
                arr[idx] = "";
                return arr;
            });
            return;
        }
        setValues((prev) => {
            const arr = [...prev];
            arr[idx] = val[0];
            return arr;
        });
        if (val && idx < inputLength - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
        if (!paste) return;
        const arr = paste.split("").slice(0, inputLength);
        setValues((prev) => {
            const newArr = [...prev];
            arr.forEach((char, i) => {
                newArr[i] = char;
            });
            return newArr;
        });
        setTimeout(() => {
            const nextIdx = arr.length < inputLength ? arr.length : inputLength - 1;
            inputsRef.current[nextIdx]?.focus();
        }, 0);
        e.preventDefault();
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !values[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otp = values.join('');
        if (otp.length !== 6) {
            return;
        }
        setIsVerifying(true);
        setExpiredError(false);
        setOtpError('');
        
        router.post('/verify-otp', { otp }, {
            onFinish: () => setIsVerifying(false),
        });
    };

    const handleResend = () => {
        if (cooldown === 0) {
            setIsResending(true);
            router.post('/resend-otp', {}, {
                onFinish: () => setIsResending(false),
            });
            setCooldown(60);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-[34px] font-medium">Verification</h1>
            <div className="text-[20px] py-2">
                <p>A verification code has been sent to</p>
                <p>{email}</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center mt-6">
                <div className="flex flex-row gap-6">
                    {values.map((val, idx) => (
                        <input
                            key={idx}
                            type="text"
                            maxLength="1"
                            className="border-0 w-10 border-b-2 border-gray-400 text-center focus:outline-none focus:border-b-[#9C0306]"
                            value={val}
                            onChange={(e) => handleChange(e, idx)}
                            onPaste={handlePaste}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={el => inputsRef.current[idx] = el}
                        />
                    ))}
                </div>
                <div className="flex flex-row text-[16px] gap-2 mt-7">
                    <button
                        type="button"
                        className="text-[#9C0306] font-medium hover:cursor-pointer"
                        onClick={handleResend}
                        disabled={cooldown > 0 || isResending}
                    >
                        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                    </button>
                </div>
                {otpError && (
                    <div className="mt-4 text-[#9C0306] text-center">
                        <p>{otpError}</p>
                        {expiredError && (
                            <p className="mt-2 text-sm font-medium">
                                Please request a new verification code.
                            </p>
                        )}
                    </div>
                )}
                <div className="mt-7 flex justify-center items-center">
                    <button
                        type="submit"
                        disabled={isVerifying}
                        className="bg-[#9C0306] text-white rounded-[20px] w-40 h-8 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </form>
        </div>
    );
}