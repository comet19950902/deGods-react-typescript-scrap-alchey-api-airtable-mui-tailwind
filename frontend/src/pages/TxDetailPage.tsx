import React, { useContext, useEffect } from 'react';
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/outline";


import { TxDetailContext } from '../context/TxDetailContext';

const TxDetailPage = () => {
    const { txData } = useContext( TxDetailContext );

    useEffect(() => {
        console.log( txData );
    }, [txData])
    
    
    return (
        <div className=' bg-white pt-[20px] rounded-lg shadow-lg'>
            <h1 className='text-center'><strong>{ `${ txData?.name} ( ${txData?.symbol} )` }</strong></h1>
            <h2 className='text-center mt-[-10px]'><strong> 0x8821b...cd280 </strong></h2>
            <p className='text-center break-words'><strong>Transaction Hash:</strong> {txData?.txHash}</p>
            <div className='w-full flex justify-center mt-[60px]'>
                <div className='
                    min-[1100px]:w-full flex max-[1100px]:flex-col min-[1100px]:justify-evenly 
                    min-[1100px]:items-start
                '>
                    <div className='flex flex-col align-center justify-center relative w-[20rem]'>
                        <span className="badge absolute top-0 right-0 mt-[-20px] text-xs font-bold leading-none text-white rounded-full">
                            { txData?.status ? <CheckCircleIcon className="h-[60px] w-[60px] fill-green-500"/> : <XCircleIcon className="h-[60px] w-[60px] fill-pink-500"/> }
                        </span>
                        <img src={ txData?.image } className='w-[20rem] h-[22rem] rounded-lg'/>
                        <div className='flex flex-col text-right mr-[50px] p-0'>
                            <h3>#{txData?.tokenId}</h3>
                            <h3 className='mt-[-10px]'>{txData?.title ? txData?.title : "--"}</h3>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <p><strong>Block Number:</strong> {txData?.block}</p>
                        <p><strong>Block Confirmations:</strong> {txData?.blockConfirm}</p>
                        <div className="py-2 flex justify-start">
                            <p className='inline'><strong>Transaction Fee:</strong></p>
                            <img className="inline self-center h-[18px] pl-[15px]" src="/public/ethereum-icon.png"/>
                            <p className='pl-[5px] inline'>{txData?.nftPrice}</p>
                        </div>
                        <div className="py-2 flex justify-start">
                            <p className='inline'><strong>Gas Fee:</strong></p>
                            <img className="inline self-center h-[18px] pl-[15px]" src="/public/ethereum-icon.png"/>
                            <p className='pl-[5px] inline'>{txData?.gasPrice}</p>
                        </div>
                    </div>
                    <hr className='min-[1100px]:hidden'/>
                    <div className='flex flex-col pb-[30px]'>
                        <p className="break-words"><strong>From:</strong> {txData?.from}</p>
                        <p className="break-words"><strong>To:</strong> {txData?.to}</p>
                        <p><strong>Date:</strong> {txData?.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TxDetailPage;
