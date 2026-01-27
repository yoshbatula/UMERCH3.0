import AccessoriesCard from "../cards/AccessoriesCard";
export default function Accessories() {
    return (
        <div className="bg-[#F6F6F6] flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center py-15">
                <h1 className="font-bold text-[42px]">UM Accessories</h1>
                <div className="mx-auto w-52 h-1 bg-[#FFB600]" />
            </div>
            <div>
                <AccessoriesCard/>
            </div>
            <div className="flex justify-center items-center p-10">
                <div className="bg-[#9C0306] flex justify-center items-center w-60 h-10 rounded-[20px] hover:cursor-pointer">
                    <button className="text-white text-[16px] font-semibold hover:cursor-pointer">SEE MORE ACCESSORIES</button>
                </div>
            </div>
        </div>
    );
}