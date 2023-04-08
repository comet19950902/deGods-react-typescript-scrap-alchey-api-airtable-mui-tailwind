import { BrowserRouter, Route, Routes } from "react-router-dom";
import HashPage from './pages/HashPage';
import { useState } from "react";

import CollectionPage from "./pages/CollectionPage";
import NFTPage from "./pages/NFTPage";
import PageLayout from "./pages/PageLayout";
import TxDetailPage from './pages/TxDetailPage';

import { TxDetailContext } from "./context/TxDetailContext";
import { CollectionContext } from "./context/CollectionContext";
import { NFTContext } from "./context/NFTContext";

import { NFT, COLLECT, TXDETAIL } from './others/dataTypes';

function App() {
    const [nftData, setNFTData] = useState<NFT[]>([]); //assuming NFT is an array of objects.
    const [colData, setColData] = useState<COLLECT>(); //assuming Collection is an array of objects.
    const [txData, setTxData] = useState<TXDETAIL>();

    // render table with data
    return (
        <PageLayout>
            <CollectionContext.Provider value={{colData, setColData}}>
                <NFTContext.Provider value={{nftData, setNFTData}}>
                    <TxDetailContext.Provider value={{txData, setTxData}}>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<CollectionPage />} />
                                <Route path="/getNFTs" element={<NFTPage />} />
                                <Route path="/hashes" element={<HashPage />} />
                                <Route path="/tx" element={<TxDetailPage />} />
                            </Routes>
                        </BrowserRouter>
                    </TxDetailContext.Provider>
                </NFTContext.Provider>
            </CollectionContext.Provider>
        </PageLayout>
    );
}

export default App;