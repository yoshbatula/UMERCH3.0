import LimitedOfferImage from '@images/LimitedOffer.png';
export default function LimitedOffer() {
    return (
        <div className="bg-[#F6F6F6] flex flex-col p-22">
           <div className='relative w-full'>
                <img src={LimitedOfferImage} alt="Limited Offer" className='object-cover w-full h-[37rem]'/>
                <div className='absolute inset-0 flex flex-col p-30'>
                    <h1 className='text-white text-[20px]'>Limited Time Offer</h1>
                    <div className='mt-4'>
                        <h1 className='text-white text-[42px]'>Special Edition</h1>
                    </div>
                    <div className='text-white mt-5 text-[16px]'>
                        <p>Lorem ipsum dolor sit amet</p>
                        <p>consectetur. Purus aenean</p>
                        <p>bibendum ipsum ligula sit velit nibh.</p>
                    </div>
                    <div className='mt-10 text-white'>
                        <h1 className='text-[20px]'>Buy T-shirt at 20% Discount,</h1>
                        <h1 className='text-[20px]'>Use Code OFF20</h1>
                    </div>
                    <div className='mt-10'>
                        <div className='bg-[#FFB600] border border-white w-30 h-10 flex justify-center items-center hover:cursor-pointer'>
                            <button className='text-[#BE0002] hover:cursor-pointer'>SHOP NOW</button>
                        </div>
                    </div>
                </div>
           </div>
        </div>
    );
}