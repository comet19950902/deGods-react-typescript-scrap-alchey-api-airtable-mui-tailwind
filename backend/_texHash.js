import { Alchemy, Network, Utils } from "alchemy-sdk";
import dotenv from 'dotenv';

dotenv.config();

//////////////////////////////////////////////////////////////
//					Start Project							//
//////////////////////////////////////////////////////////////
// collection address
const colAddress = "0x8821bee2ba0df28761afff119d66390d594cd280";
const txHash = "0xb64c19f171013d936b2b2db7355690af9ebade4bfbef5d1d8c4d7f27f495e8a3";
	
// configure for alchemy
const config = {
	apiKey: "BulCaczA8_MGcz34wlxGZNPVslXQOgRi",
	network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

alchemy.core.getTransactionReceipt(txHash).then((tx) => {
	if (!tx) {
		console.log("Pending or Unknown Transaction");
	} else if (tx.status === 1) {
		console.log("Transaction was successful!");
	} else {
		console.log("Transaction failed!");
	}

	console.log( tx )
});