import { createContext, useContext } from "react";
import { COLLECT } from '../others/dataTypes';

interface ColState {
    colData: COLLECT | undefined;
    setColData: (data: COLLECT) => void;
}

export const CollectionContext = createContext<ColState>({
    colData: undefined,
    setColData: () => {},
});

export const useColContext = () => useContext(CollectionContext);