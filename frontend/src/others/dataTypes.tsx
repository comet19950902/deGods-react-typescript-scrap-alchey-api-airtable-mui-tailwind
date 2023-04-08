// for Collection Table Row
export interface COLLECT {
	id: number,
	address: string,
	logoUrl: string,
	name: string,
	symbol: string,
	listings: string,
	floorPrice: string,
	volumn: string
}

// for NFT Card
export interface NFT {
	id: number,
	occur: string,
	toeknId: string,
	price: string,
	lastDate: string,
	imageUrl: string
}

// for Collection Table Header Cell Item
export interface ITABLEHCELLPROPS {
    cellType: string;
    cellName: string;
    handleSort: any;
}

// for TxDetail Card Page
export interface TXDETAIL {
    txHash: string;
    tokenId: number;
    block: number;
    gas: number;
    gasPrice: number;
    nftPrice: number;
    blockConfirm: number;
    status: string;
    from: string;
    to: string;
    name: string;
    symbol: string;
    title: string;
    date: string;
    image: string;
}

// for TxHash Table
export interface HASH{
    txHash: string;
    tokenId: string;
    tokenIdPrt:string;
    from: string;
    to: string;
}

//export const BASE_URL:string = "http://154.29.74.58:2083";
export const BASE_URL:string = "http://localhost:2083";
//export const BASE_URL:string = "https://sudomonitor.vercel.app";