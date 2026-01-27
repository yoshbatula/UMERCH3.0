import React from "react";
import { Link } from "@inertiajs/react";
import Location from '@images/Location.svg';
import Phone from '@images/Phone.svg';
import Email from '@images/Email.svg';
import Facebook from '@images/Facebook.svg';
import Instagram from '@images/Instagram.svg';
import Twitter from '@images/Twitter.svg';
import Youtube from '@images/Youtube.svg';
export default function Footer({ onSignInClick  }) {
    return (
        <>
        <div className="p-8 bg-[#F6F6F6] flex flex-col justify-center items-center">
            <div className="flex flex-row gap-30">
                <div className="flex flex-col">
                    <h1 className="text-[20px]">Menu</h1>
                    <div className="mt-1 flex flex-col text-[#727272] gap-1">
                        <Link href="/" onClick={onSignInClick}>Home</Link>
                        <Link href="#">Shop</Link>
                        <Link href="#">About us</Link>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-[20px]">Categories</h1>
                    <div className="mt-1 flex flex-col text-[#727272] gap-1">
                        <Link href="#">Wardrobe</Link>
                        <Link href="#">Accessories</Link>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-[20px]">Contact Us</h1>
                    <div className="mt-1 flex flex-row text-[#727272] gap-2">
                        <img src={Location} alt="Location-Icon"/>
                        <div className="flex flex-col text-start">
                            <p>Bolton St, Poblacion District,</p>
                            <p>Davao City, 8000 Davao del Sur</p>
                        </div>
                    </div>
                    <div className="mt-1 flex flex-row text-[#727272] gap-2">
                        <img src={Email} alt="Email-Icon"/>
                        <div className="flex flex-col text-start">
                            <p>demo@example.com</p>
                            <p>info@example.com</p>
                        </div>
                    </div>
                    <div className="mt-1 flex flex-row text-[#727272] gap-2">
                        <img src={Phone} alt="Phone-Icon"/>
                        <div className="flex flex-col text-start">
                            <p>01234567890</p>
                            <p>01234567890</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-[20px]">Social Media</h1>
                    <div className="mt-1 flex flex-row text-[#727272] gap-2">
                        <Link href="#"><img src={Facebook} alt="Facebook-Icon" /></Link>
                        <Link href="#"><img src={Instagram} alt="Instagram-Icon" /></Link>
                        <Link href="#"><img src={Youtube} alt="Youtube-Icon" /></Link>
                        <Link href="#"><img src={Twitter} alt="Twitter-Icon" /></Link>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-6 bg-white flex justify-center items-center">
            <h1 className="text-[#727272] font-medium">Copyright © 2025 UMerch | Powered by Univebersity of Mindanao</h1>
        </div>
        </>
    );
}