import ProductCard from '../cards/ProductCards';
export default function FeatureProducts() {
    return (
        <div className="bg-[#F6F6F6] mt-20">
            <div className="flex flex-col justify-center items-center py-15">
                <h1 className="font-bold text-[42px]">Feature Products</h1>
                <div className="mx-auto w-52 h-1 bg-[#FFB600]" />
            </div>
            {/* Feature Cards */}
            <div className='flex flex-row flex-wrap justify-center gap-6'>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
                <ProductCard/>
            </div>
            <div className='mt-8 flex justify-center items-center'>
                <div className='bg-[#9C0306] w-55 h-10 rounded-[20px] flex justify-center items-center hover:cursor-pointer'>
                    <button className='text-white text-[16px] font-semibold hover:cursor-pointer'>SEE MORE PRODUCTS</button>
                </div>
            </div>
        </div>
    );
}