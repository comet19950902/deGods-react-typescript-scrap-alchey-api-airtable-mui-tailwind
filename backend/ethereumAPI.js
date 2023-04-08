import { ApolloServer, gql } from 'apollo-server-express';
import { Alchemy, Network, SortingOrder } from "alchemy-sdk";
import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

let colAddr = "0x8821bee2ba0df28761afff119d66390d594cd280";
let txHashAddrs = [];
let transfers = [];
let selcTxHashAddr = "";
let selcNFT = "";

// configure for alchemy
const config = {
	apiKey: "BulCaczA8_MGcz34wlxGZNPVslXQOgRi",
	network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const hexToDecimal = hexVal_ => parseInt(hexVal_, 16);

const getNFT = async ( tokenId_ ) => {
	const selcNFT = await alchemy.nft.getNftMetadata(
		colAddr,
		tokenId_
	);

	return selcNFT;
}

// Get transfer hashs;
const getTxHashes = async ( colAddr_ ) => {
	const trans = await alchemy.core.getAssetTransfers({
		"fromBlock": "0x0",
		"toBlock": "latest",
		"contractAddresses": [
			colAddr_
		],
		"category": [
			"erc721"
		],
		"order": "desc",
		"withMetadata": true,
		"excludeZeroValue": true,
		"maxCount": 2
	});

	for( let i=0; i<trans.transfers.length; i++ ){
		
		txHashAddrs.push( {
			"txHash": trans.transfers[i].hash,
			"tokenId": hexToDecimal( trans.transfers[i].erc721TokenId ),
			"from": trans.transfers[i].from,
			"to": trans.transfers[i].to,
		} );
	}

	return txHashAddrs;
}

//await getTxHashes( colAddr );

// Get tx detail
const getTxDetail = async( txHashAddrs_ ) => {
	let tmpObj = {};

	transfers = [];
	for( let i=0; i<txHashAddrs_.length; i++){
		await alchemy.core.getTransactionReceipt( txHashAddrs_[i].txHash ).then((tx) => {
			tmpObj.txHash = tx.transactionHash;
			tmpObj.tokenId = hexToDecimal( txHashAddrs_[i].tokenId );
			tmpObj.block = tx.blockNumber;
			tmpObj.gas = hexToDecimal( tx.gasUsed._hex );
			tmpObj.gasPrice = hexToDecimal( tx.effectiveGasPrice._hex ) / 1e18;
			tmpObj.nftPrice = tmpObj.gas * tmpObj.gasPrice;
			tmpObj.blockConfirm = tx.confirmations;
			tmpObj.status = tx.status;
			tmpObj.from = tx.from;
			tmpObj.to = tx.to;
		});
		
		let tmUnique = await getNFT( tmpObj.tokenId );

		tmpObj.name = tmUnique.contract.name;
		tmpObj.symbol = tmUnique.contract.symbol;
		tmpObj.title = tmUnique.title;
		tmpObj.date = tmUnique.timeLastUpdated;
		tmpObj.image = tmUnique.rawMetadata.image;

		transfers.push( tmpObj );
	}

	return transfers;
}

//await getTxDetail( txHashAddrs );



//console.log( await getNFT( txHashAddrs[0] ) );










/********************************************************
*						  Get txHashAddrs 				*
********************************************************/

/* // GraphQL schema
const typeDefs = gql`
    type Transfer {
        id: ID!
        tokenId: String!
        transactionHash: String!
        blockNumber: String!
        blockTimestamp: String!
        from: String!
        to: String!
    }

    type Query {
        transfers: [Transfer]
    }
`;

//Resolving queries with real-time data
const resolvers = {
    Query: {
        transfers: async () => {
            try {
                const response = await axios.post(
                    'https://api.thegraph.com/subgraphs/name/comet19950902/degos',
                    {
                        query: `
                            {
                                transfers(first:1000, orderBy:blockTimestamp, orderDirection:desc){
                                    id,
                                    tokenId,
                                    transactionHash,
                                    blockNumber,
                                    blockTimestamp,
                                    from,
                                    to
                                }
                            }
                        `,
                    }
                );
                const data = response.data.data.transfers;
                console.log(data); // Print the data to console
                return data;
            } catch (error) {
                console.error(error);
            }
        },		
    },
};

// Creating an instance of the Apollo server using our typeDefs and resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// Initializing express app 
const app = express();

async function startServer() {
    // Start the server
    await server.start();

    // Integrate with apollo server
    server.applyMiddleware({ app });

    // Listen on port 3000
    app.listen({ port: 3000 }, async () => {
        console.log(`🌟 Server ready at http://localhost:3000${server.graphqlPath}`);
        // Execute the transfers query and print the result
        const { data } = await server.executeOperation({
            query: `
                query {
                    transfers {
                        id
                        tokenId
                        transactionHash
                        blockNumber
                        blockTimestamp
                        from
                        to
                    }
                }
            `,
        });
        console.log(data.transfers[0]);
    });
}  

// Call startServer function to start the server
startServer(); */