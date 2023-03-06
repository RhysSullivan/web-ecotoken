import React from "react";
import credit_card_back from "@ecotoken/ui/assets/ecoproject/benefit_CarbonSequestor.jpg";
import Image from "next/image";

const Preview = ({ image, displayData }: { image: any; displayData: any }) => {
    return (
        <div className="relative">
            <Image
                src={credit_card_back}
                alt="Credit Card Background"
                className="h-[500px] w-[500px] rounded-2xl"
            />
            <div className="absolute  top-[5em] left-5">
                <h1 className="whitespace-pre-line text-[85px] font-extrabold tracking-tight text-[#ededed7a]">
                    Carbon
                </h1>
                <h1 className="mt-[60px] whitespace-pre-line text-[85px] font-extrabold leading-10 tracking-tight text-[#ededed7a]">
                    Credits
                </h1>
                <div className="flex gap-3">
                    <div className="mt-10 flex flex-col gap-3">
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Credits:
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Project:
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Location:
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Producer:
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Retired by:
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Date:
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Credit ID:
                        </label>
                    </div>
                    <div className="mt-10 flex flex-col gap-3">
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            12 CO2
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Sandy Cross Forest Preservation
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Lexington, Ohio, USA
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            Western Reserve Land Conservancy
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            NFTphile
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            May 10, 2023
                        </label>
                        <label className="text-[18px] font-semibold text-white drop-shadow">
                            424242-424242-4242-4242
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preview;
