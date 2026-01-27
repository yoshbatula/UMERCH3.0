import AccessoriesCard from "../../../components/cards/AccessoriesCard";
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
        </div>
    );
}