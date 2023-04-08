import { useContext } from "react";

import NFTCard from "../components/NFTCard";
import { CollectionContext } from '../context/CollectionContext';
import { NFTContext } from '../context/NFTContext';

const NFTPage = () => {
    const { colData } = useContext( CollectionContext );
    const { nftData } = useContext( NFTContext );

    return (
        <div>
            <div className="flex justify-center">
                {
                    colData
                        ?
                            <div className="block">
                                <div className="flex justify-center">
                                    <img className="inline-block h-[80px] w-[80px] rounded-full ring-2 ring-white"
                                        src={colData.logoUrl} alt="{user.handle}"
                                    />
                                </div>
                                <h1 className="font-sans text-center">
                                    {colData.address.slice(0,6)}...
                                </h1>
                                <div className="mt-[-20px]">
                                    <div className=" flex flex-wrap justify-center space-x-20">
                                        <div>
                                            <p className="text-[20px] font-bold">
                                                Floor Price
                                            </p>
                                            <div className="flex justify-center items-center mt-[-15px]">
                                                <img className=" inline h-[24px]" src='/public/ethereum-icon.png'/>
                                                <span className="
                                                    inline text-lg font-semibold text-black px-2
                                                ">
                                                    {colData.floorPrice}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[20px] font-bold">
                                                Listings
                                            </p>
                                            <div className="flex justify-center items-center mt-[-15px]">
                                                <span className="
                                                    inline text-lg font-semibold text-black px-2
                                                ">
                                                    {colData.listings}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[20px] font-bold">
                                                Volumn
                                            </p>
                                            <div className="flex justify-center items-center mt-[-15px]">
                                                <img className=" inline h-[24px]" src='/public/ethereum-icon.png'/>
                                                <span className="
                                                    inline text-lg font-semibold text-black px-2
                                                ">
                                                    {colData.volumn}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        :
                            null
                }
            </div>
            <div className="flex flex-wrap justify-center space-x-6 space-y-6">
                {nftData?.map((nft:any, idx:number) => (
                    idx == 0
                        ?
                            <div key={nft.id} className="pl-6 py-6">
                                <NFTCard nft={nft} />
                            </div>
                        :
                            <div key={nft.id}>
                                <NFTCard nft={nft} />
                            </div>
                ))}
            </div>
        </div>
    );
}

export default NFTPage;