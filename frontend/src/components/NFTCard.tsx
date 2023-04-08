export default function NFTCard( nft:any ) {
    const nftData = nft.nft.fields;
    
    return (
        <div className="rounded shadow-lg w-[9rem] bg-white p-1 border-2 border-black cursor-pointer">
            <div className="flex justify-center">
                <img className="h-[8.5rem] self-center py-1"
                    src={ nftData.imageUrl } 
                    alt="Sunset in the mountains"
                />
            </div>
            <div className="px-2">
                <p className="text-black mt-[2px] font-sans text-xs"> # { nftData.tokenId } </p>
                <p className="text-black mt-[-15px] mb-0 font-semibold font-sans text-base"> # { nftData.tokenId } </p>
            </div>
            <div className="py-2 flex justify-end bg-gray-700 rounded-[5px]">
                <img className=" inline h-[18px]" src='/public/ethereum-icon.png'/>
                <span className="
                    inline text-sm font-semibold text-white text-right px-2
                ">
                    {nftData.price}
                </span>
            </div>
        </div>
    );
}