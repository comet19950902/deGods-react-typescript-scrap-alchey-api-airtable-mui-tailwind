import { createContext, useContext } from "react";
import { NFT } from '../others/dataTypes';

interface NFTState {
    nftData: NFT[];
    setNFTData: (data: NFT[]) => void;
}

export const NFTContext = createContext<NFTState>({
    nftData: [],
    setNFTData: () => {},
});

export const useNFTContext = () => useContext(NFTContext);