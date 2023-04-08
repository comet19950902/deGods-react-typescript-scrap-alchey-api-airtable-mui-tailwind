import { createContext, useContext } from "react";
import { TXDETAIL } from '../others/dataTypes';

interface TxState {
    txData: TXDETAIL | undefined; // updated
    setTxData: (data: TXDETAIL) => void;
}

export const TxDetailContext = createContext<TxState>({
    txData: undefined, // updated
    setTxData: () => {},
});

export const useTxDetailContext = () => useContext(TxDetailContext);