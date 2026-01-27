import ProductCard from '../../../components/cards/ProductCards';
export default function FeaturedProducts() {
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
        </div>
    );
}