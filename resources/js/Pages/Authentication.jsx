import React, { useRef, useState, useEffect } from "react";
import { Inertia } from '@inertiajs/inertia';

export default function Authentication({ email }) {
    const inputLength = 6;
    const [values, setValues] = useState(Array(inputLength).fill(""));
    const inputsRef = useRef([]);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

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
        Inertia.post('/verify-otp', { otp });
    };

    const handleResend = () => {
        if (cooldown === 0) {
            Inertia.post('/resend-otp');
            setCooldown(60); // 60 seconds
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
                        disabled={cooldown > 0}
                    >
                        {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                    </button>
                </div>
                <div className="mt-7 flex justify-center items-center">
                    <button type="submit" className="bg-[#9C0306] text-white rounded-[20px] w-40 h-8 hover:cursor-pointer">Verify</button>
                </div>
            </form>
        </div>
    );
}