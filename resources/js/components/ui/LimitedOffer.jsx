import LimitedOfferImage from '@images/LimitedOffer.png';
import { Link } from '@inertiajs/react';
export default function LimitedOffer() {
    return (
        <div className="bg-[#F6F6F6] flex flex-col p-22">
            <div className='relative bg-[#9C0306] w-full h-100'>
                <div className='p-10 flex flex-col h-full gap-2 transform -translate-y-[-80px]'>
                    <h2 className='text-white text-3xl font-bold' style={{ fontFamily: 'Cormorant Garamond' }}>LIMITED TIME OFFER!</h2>
                    <h1 className='text-white text-3xl font-bold' style={{ fontFamily: 'Cormorant Garamond' }}>SPECIAL EDITION</h1>
                    <Link className='text-[#9C0306] bg-[#FBB600] rounded-[10px] w-32 h-10 flex items-center justify-center font-light text-[14px] leading-tight' href="/Products" prefetch>
                        SHOP NOW
                    </Link>
                </div>
            </div>
        </div>
    );
}