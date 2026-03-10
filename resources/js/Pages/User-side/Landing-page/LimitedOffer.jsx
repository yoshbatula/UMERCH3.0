import LimitedOfferImage from '@images/BG-LIMITED-OFFER.svg';
import { Link } from '@inertiajs/react';
export default function LimitedOffer() {
    return (
        <div className="bg-[#F6F6F6] flex flex-col px-16 py-8">
            <div className="bg-[#9C0306] flex flex-row items-center h-100 px-16 py-12 overflow-hidden">
                <div className='flex flex-col gap-4'>
                    <h2 className='text-white text-3xl font-bold' style={{ fontFamily: 'Cormorant Garamond' }}>LIMITED TIME OFFER!</h2>
                    <h1 className='text-white text-3xl font-bold' style={{ fontFamily: 'Cormorant Garamond' }}>SPECIAL EDITION</h1>
                    <Link className='text-[#9C0306] bg-[#FBB600] rounded-[20px] w-32 h-10 flex items-center justify-center font-light text-[14px] leading-tight' href="/Shop" prefetch>
                        SHOP NOW
                    </Link>
                </div>
                <div className='ml-auto absolute transform translate-x-[400px] translate-y-[-35px]'>
                    <img src={LimitedOfferImage} alt="Limited Offer" className='max-h-[600px] object-contain' />
                </div>
            </div>
        </div>
    );
}