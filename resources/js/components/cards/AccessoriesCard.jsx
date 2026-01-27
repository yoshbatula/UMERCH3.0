import Tumbler from "@images/tumbler-wood.jpg";
import RegularTumbler from "@images/tumbler.png"
import Mugs from "@images/mug.png"
import Notebooks from "@images/notebook.png"
export default function AccessoriesCard() {
    return (
        <div className="flex flex-col mb-10">
            <div className="flex flex-row flex-wrap gap-4">
                    <div className="flex flex-col">
                    <img src={Tumbler} alt="Accessories" className="h-80"/>
                    <div className="mt-2">
                        <h1 className="font-semibold text-[16px]">UM Wooden<br/>Tumbler</h1>
                    </div>
                </div>
                <div className="flex flex-col">
                    <img src={RegularTumbler} alt="Accessories" className="h-80"/>
                    <div className="mt-2">
                        <h1 className="font-semibold text-[16px]">UM Regular<br/>Tumbler</h1>
                    </div>
                </div>
                <div className="flex flex-col">
                    <img src={Mugs} alt="Accessories" className="h-80"/>
                    <div className="mt-2">
                        <h1 className="font-semibold text-[16px]">UM Mug | Wildcats</h1>
                    </div>
                </div>
                <div className="flex flex-col">
                    <img src={Notebooks} alt="Accessories" className="h-80"/>
                    <div className="mt-2">
                        <h1 className="font-semibold text-[16px]">UM Notebook</h1>
                    </div>
                </div>
            </div>
        </div>    
    );
}