import React from "react";
import Tshirt from '@images/tshirt.jpg';
export default function All() {
    return (
        <>
            <div className="flex flex-col items-center justify-center p-4 py-10">
                <div className="flex flex-col bg-white w-300 h-73 rounded-[10px]">
                    <div className="flex flex-row w-full p-4">
                        <h1 className="text-[#575757] text-[13px]">Order ID: 0001</h1>
                        <div className="ml-auto flex flex-row gap-2">
                            <h1 className="text-[16px] text-[#9C0306] ">To Pay</h1>
                        </div>
                    </div>
                    <div className="py-8 p-4">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-center gap-2 w-full">
                                <img src={Tshirt} alt="tshirt" className="w-20 h-20 rounded-[10px]" />
                                <div className="flex flex-col items-start justify-center gap-1">
                                    <h1 className="text-[15px] font-semibold">UM CCE Esports Jersey</h1>
                                    <span className="text-[10px]">Medium</span>
                                    <span className="text-[10px] text-[#9C0306]">x1</span>
                                </div>
                                <div className="flex ml-auto items-center justify-center">
                                    <h1 className="text-[13px] text-[#9C0306] font-medium">₱500</h1>
                                </div>
                            </div>
                            <div className="py-5 flex flex-rowv ml-auto items-center gap-5">
                                <span className="text-[#5C5C5C] text-[13px] font-medium">Order Total:</span>
                                <h1 className="text-[#9C0306] text-[20px] font-medium">₱500</h1>
                            </div>
                            <div className="flex flex-rowv ml-auto items-center gap-5">
                                <span className="text-[#031A9C] text-[13px] font-medium underline">Upload Proof of Payment Here</span>
                                <div className="bg-[#9C0306] text-white w-30 h-9 flex items-center justify-center rounded-[20px] hover:cursor-pointer">
                                    <button className="text-[12px] font-medium">Upload File</button>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}