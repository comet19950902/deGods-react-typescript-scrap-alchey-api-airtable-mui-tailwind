import { Alchemy, Network } from "alchemy-sdk";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import path from "path";
import dayjs from 'dayjs';
import puppeteer from 'puppeteer';
import { fileURLToPath } from "url";

////////////////////////////////////////////////////////////
//						sart server						  //
////////////////////////////////////////////////////////////
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 2083;
const IP_ADDRESS = "127.0.0.1";
//const IP_ADDRESS = "154.29.74.58";

const __filename = fileURLToPath( import.meta.url );

const __dirname = path.dirname( __filename );

app.use( express.static( __dirname + "/build" ) );

app.get("", (req, res) => {
	res.sendFile(__dirname + "/build/index.html");
});

// start the server
app.listen( PORT, IP_ADDRESS, () => {
	console.log(`Server listening on ${IP_ADDRESS}:${PORT}`);
});

//////////////////////////////////////////////////////////////
//					Start Project							//
//////////////////////////////////////////////////////////////

let colAddr = "0x8821bee2ba0df28761afff119d66390d594cd280";         // DeGods
let colAddress = "0x5Af0D9827E0c53E4799BB226655A1de152A425a5";      // sudoswap-Milady
let txHashAddrs = [];                                               // Transaction Hashes
let transfer = {};                                                  // Selected transaction

// configure for alchemy
const config = {
	apiKey: "BulCaczA8_MGcz34wlxGZNPVslXQOgRi",
	network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const hexToDecimal = hexVal_ => parseInt(hexVal_, 16);

// parse url for airtable
const url = ( param ) => {
	return `https://api.airtable.com/v0/appn1gRuLtx22e5p6/${param}`;
}

const Headers = {
	headers: {
		"Content-Type": "application/json",
		"accept": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Authorization": `Bearer key2OfbPofuEs2Uwj`,
	},
}

const query = ( key_, val_) => {
	return{
		filterByFormula: `${key_}='${val_}'`
	}
};

/*************************************************************************************
|| 									ALCHEMY API 									||
*************************************************************************************/
// get nfts from alchemy
const getNFTs = async ( pageKey_ ) => {
	const opts = {
		pageKey: pageKey_,
		omitMetadata: false,
		//pageSize: 100, => default
	};

	const fetchedNFTs  = await alchemy.nft.getNftsForContract(colAddress, opts);

	return fetchedNFTs.nfts;
};

const getNFT = async ( tokenId_ ) => {
	const selcNFT = await alchemy.nft.getNftMetadata(
		colAddr,
		tokenId_
	);

    console.log( selcNFT )
    console.log( '*************************' )

	return selcNFT;
}

// Get transfer hashs;
const getTxHashes = async ( colAddr_ ) => {
	txHashAddrs = [];
	
	const trans = await alchemy.core.getAssetTransfers({
		"fromBlock": "0x",
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
	});

	for( let i=0; i<trans.transfers.length; i++ ){
        //if( trans.transfers[i].value != null ){
		let tId = hexToDecimal( trans.transfers[i].erc721TokenId );

        txHashAddrs.push( {
            "txHash": trans.transfers[i].hash,
            "tokenId": trans.transfers[i].erc721TokenId,
            "tokenIdPrt": tId,
            "from": trans.transfers[i].from,
            "to": trans.transfers[i].to,
        } );  
        //}
	}

	return txHashAddrs;
}

// Get tx detail
const getTxDetail = async( txHashAddrs_ ) => {
    let tmpObj = {};

	await alchemy.core.getTransactionReceipt( txHashAddrs_.txHash ).then((tx) => {
        tmpObj.txHash = tx.transactionHash;
        tmpObj.tokenId = hexToDecimal( txHashAddrs_.tokenId );
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

    tmpObj.image = tmUnique.rawMetadata.image;
    tmpObj.name = tmUnique.contract.name;
    tmpObj.symbol = tmUnique.contract.symbol;
    tmpObj.title = tmUnique.title;
    tmpObj.date = tmUnique.timeLastUpdated;

    transfer = tmpObj;

    console.log( transfer )
    console.log( '-----------------------')
    console.log(tmpObj)

	return transfer;
}

/*************************************************************************************
|| 									SCRAPING BOT 									||
*************************************************************************************/
// scraping data from sudoswap
const scrapingBot = async () => {
	try {
		// get Value of Item
		const getText = async (dom) => {
			const result = await page.evaluate((dom) => {
				if( dom === '.text-truncate' ) {
					return Array.from(document.querySelectorAll(dom), (el) => el.innerHTML.slice(2).trim());
				}else{
					return Array.from(document.querySelectorAll(dom), (el) => el.innerHTML.trim());
				}
			}, dom );
			  
			return result;
		}

		// get src of img tag
		const getUrl = async (dom) => {
			const result = await page.evaluate((dom) => {
				return Array.from(document.querySelectorAll(dom), (el) => el.src);
			}, dom );
			  
			return result;
		}

		///const browser = await puppeteer.launch({headless: true});
		const browser = await puppeteer.launch({
			executablePath: process.env.CHROME_BIN || null,
		});
		const page = await browser.newPage();
	
		await page.goto( `https://sudoswap.xyz/#/browse/buy/${ colAddress }`, {timeout: 4000000});
		
		await page.waitForTimeout(10000).then(() => console.log('Waited a second!'));
		await page.screenshot({path: 'screenshot.png'});
		
		const statValues = await page.evaluate(()=>{
			const spanTags = document.querySelectorAll('.statValue span');
			return [...spanTags].map(span => span.innerHTML.trim());
		});

		const listings = await page.$eval('.listingTokenPillBadge', element => element.innerHTML.trim());
		const colName = await getText('.nftName');
		const colIcon = await getUrl('.nftIcon');

		// collection info
		const collection = {
			address: colAddress,
			logoUrl: colIcon[0].split("?")[0],
			name: colName[0],
			symbol: '',
			listings: listings,
			floorPrice: statValues[0],
			bestOffer: statValues[1],
			offerTVL: statValues[2],
			volumn: statValues[3]
		}
		
		// click the "Load More" button until it disapears.
		let loadMore = true;
		while ( loadMore ) {
			try {
				await page.click('.loadMoreBtn');
				await page.waitForTimeout(3000)
					.then(()=> console.log('button clicked') );
			} catch {
				loadMore = false;
			}
		}

		const imageUrls = await getUrl('.nftCardImage');
		const tokenIds = await getText('.text-truncate');
		const nftNames = await getText('.nameWrapper');
		const nftPrices = await getText('.priceContainer div');
		const lastDate = dayjs().format('YYYY-MM-DD');

		// nfts info listed.
		const nfts = tokenIds.map((tokenId, index) => {
			return {
				address: colAddress,
				tokenId: tokenId,
				name: nftNames[index],
				price: nftPrices[index],
				lastDate: lastDate,
				imageUrl: imageUrls[index].split("?")[0],
			};
		});

		await browser.close();

		return{
			collection: collection,
			nfts: nfts
		}
	} catch (error) {
		console.error(error);
	}
}

// get scraping data
app.get('/scraping', async (req, res) => {
	const {collection, nfts } = await scrapingBot();

	// Remove all records that match the given condition
	const collectionRecords = await getAllRecords('collectionTB');
	for (let i = 0; i < collectionRecords.length; i++) {
		if (collectionRecords[i].fields.address === colAddress) {
			await deleteRecord('collectionTB', collectionRecords[i].id);
		}
	}

	// Remove all records that match the given condition
	const nftRecords = await getAllRecords('nftTB');
	for (let i = 0; i < nftRecords.length; i++) {
		if (nftRecords[i].fields.address === colAddress) {
			await deleteRecord('collectionTB', nftRecords[i].id);
		}
	}
	
	await createRecord( "collectionTB", collection );	
	nfts.map( async(nft) => (
		await createRecord( "nftTB", nft )
    ));
	
	res.status(200).json({ status: "success", data: { collection, nfts} });
});

/*************************************************************************************
|| 									FRONTEND API 									||
*************************************************************************************/
// get collection : from airtable
app.get('/getCollections', async (req, res) => {
	const data = await getAllRecords( 'collectionTB' );
	res.status(200).json({ status: "success", data: data });
});

// get all NFTs : from airtable
app.get('/getNFTs/view', async (req, res) => {	
	const data = await getAllRecords( 'nftTB' );
	res.status(200).json({ status: "success", data: data });
});

// get NFTs of given collection : from airtable
app.get('/getNFTs', async (req, res) => {
	try {
		const occurValue = req.query.occur || 'default_value';
		const data = await getRecords( 'nftTB', query( 'address', occurValue ) );
			
		res.status(200).json({ status: "success", data: data });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error retrieving data from Airtable.');
	}
});

// endpoint to get all hashes
app.get('/hashes', async (req, res) => {
	await getTxHashes(colAddr);
	res.send( txHashAddrs );
});

// endpoint to get tx detail by hash
app.get('/tx/', async (req, res) => {
    try {
		const txHash = req.query.tx || 'default_value';
		const tokenId = req.query.tokenId || 'default_value';

        await getTxDetail( { txHash:txHash, tokenId: tokenId } );
        res.status(200).json({ status: "success", data: transfer });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error retrieving data from Airtable.');
	}
});

/*************************************************************************************
|| 									AIRTABLE CRUD api								||
*************************************************************************************/
// Get all records from a table
const getAllRecords = async (tableName) => {
    try {
		const response = await axios.get(
			url( tableName ),
			Headers
		);
        return response.data.records;
    } catch (error) {
        console.error(error);
    }
}

// Get records with condition from a table
const getRecords = async( tableName, query ) => {
	try{
		const response = await axios.get(
			url( tableName ),
			{
				headers: Headers.headers,
				params: query
			}
		);

		return response.data.records;
	}catch(error){
		console.error(error);
	}
}

// Create a new record in a table
const createRecord = async (tableName, data_) => {
	try {
        const response = await axios.post(
			url(tableName), 
			{
				fields: data_
			},
			{
				headers: Headers.headers,
			},			
		);

		return response.data;
    } catch (error) {
        console.error(error);
    }
}


// Update an existing record in a table
const updateRecord = async (tableName, recordID, data) => {
    try {
        const response = await axios.put( 
			url(`${tableName}/${recordID}`), 
			{
				fields: data
			}, { Headers }
		);
			
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Delete an existing record from a table
const deleteRecord = async (tableName, recordID) => {
    try {
        const response = await axios.delete(
			url( `${tableName}/${recordID}` ),
			Headers
		);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}