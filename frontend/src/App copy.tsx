import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CollectionPage from "./pages/CollectionPage";
import NFTPage from "./pages/NFTPage";
import PageLayout from "./pages/PageLayout";
import { CollectionContext } from "./context/CollectionContext";
import { NFTContext } from "./context/NFTContext";
import { NFT, COLLECT } from './others/dataTypes';

export default function App() {
    const [nftData, setNFTData] = useState<NFT[]>([]); //assuming NFT is an array of objects.
    const [colData, setColData] = useState<COLLECT>(); //assuming Collection is an array of objects.

    return (
        <PageLayout>
            <CollectionContext.Provider value={{colData, setColData}}>
                <NFTContext.Provider value={{nftData, setNFTData}}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<CollectionPage />} />
                            <Route path="/getNFTs" element={<NFTPage />} />
                        </Routes>
                    </BrowserRouter>
                </NFTContext.Provider>
            </CollectionContext.Provider>
        </PageLayout>
    );
}