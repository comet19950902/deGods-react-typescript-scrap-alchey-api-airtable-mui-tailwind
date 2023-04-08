import { useState } from "react";
import axios from 'axios';
import ReactLoading from 'react-loading';
import { BASE_URL } from "../others/dataTypes";

const PageLayout = ( props:any  ) => {
    const [profile, setProfile] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleRedirect = async( path:string ) => {
        location.replace(`/${path}`);
    }

    const handleImportClick = async() => {
        try {
            setLoading(true);
            await axios.get( `${BASE_URL}/scraping`);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            location.replace(`/`);
        }
    }

    return (
        <>
        {
            loading 
            ?
                <div className='flex justify-center mt-[10%]'>
                    <ReactLoading type = "bubbles" color="#0000ff" height={'20%'} width={'20%'} />
                </div>
            :
                <div className="bg-gray-200 w-full min-height-[600px]">
                    <nav className=" bg-white shadow">
                        <div className="container px-6 justify-between h-16 flex items-center lg:items-stretch mx-auto">
                            <div className="h-full flex items-center">
                                <div className="mr-10 flex items-center">
                                    <svg aria-label="Home" id="logo" enableBackground="new 0 0 300 300" height={44} viewBox="0 0 300 300" width={43} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                        <g>
                                            <path
                                                fill="#4c51bf"
                                                d="m234.735 35.532c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16zm0 24c-4.412 0-8-3.588-8-8s3.588-8 8-8 8 3.588 8 8-3.588 8-8 8zm-62.529-14c0-2.502 2.028-4.53 4.53-4.53s4.53 2.028 4.53 4.53c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.027-4.53-4.529zm89.059 60c0 2.501-2.028 4.529-4.53 4.529s-4.53-2.028-4.53-4.529c0-2.502 2.028-4.53 4.53-4.53s4.53 2.029 4.53 4.53zm-40.522-5.459-88-51.064c-1.242-.723-2.773-.723-4.016 0l-88 51.064c-1.232.715-1.992 2.033-1.992 3.459v104c0 1.404.736 2.705 1.938 3.428l88 52.936c.635.381 1.35.572 2.062.572s1.428-.191 2.062-.572l88-52.936c1.201-.723 1.938-2.023 1.938-3.428v-104c0-1.426-.76-2.744-1.992-3.459zm-90.008-42.98 80.085 46.47-52.95 31.289-23.135-13.607v-21.713c0-2.209-1.791-4-4-4s-4 1.791-4 4v21.713l-26.027 15.309c-1.223.719-1.973 2.029-1.973 3.447v29.795l-52 30.727v-94.688zm0 198.707-80.189-48.237 51.467-30.412 24.723 14.539v19.842c0 2.209 1.791 4 4 4s4-1.791 4-4v-19.842l26.027-15.307c1.223-.719 1.973-2.029 1.973-3.447v-31.667l52-30.728v94.729z"
                                            />
                                        </g>
                                    </svg>
                                    <h3 className="text-base text-gray-800 font-bold tracking-normal leading-tight ml-3 hidden lg:block">Sudoswap</h3>
                                </div>
                                <ul className="pr-12 flex items-center h-full">
                                    <li
                                        className="cursor-pointer h-full flex items-center text-sm text-indigo-700 tracking-normal border-b-2 border-indigo-700"
                                        onClick={() => handleRedirect('')}
                                    >
                                        Collections
                                    </li>
                                    <li
                                        className="pl-[50px] cursor-pointer h-full flex items-center text-sm text-indigo-700 tracking-normal border-b-2 border-indigo-700"
                                        onClick={() => handleRedirect('hashes')}
                                    >
                                        Transactions
                                    </li>
                                </ul>
                            </div>
                            <div className="h-full flex items-center justify-end">
                                <div className="w-full h-full flex items-center">
                                    
                                    <div className="w-full h-full flex">
                                        <div className="w-32 h-full flex items-center justify-center border-r cursor-pointer text-gray-600">
                                            <button className="flex justify-center outline-none border-none bg-blue-500 hover:bg-blue-400 active:bg-blue-700 focus:outline-none shadow-md rounded-lg py-.5 px-3 text-white cursor-pointer"
                                                onClick={ handleImportClick }
                                            >
                                                <p className="px-3">Import</p>
                                            </button>
                                        </div>
                                        <div aria-haspopup="true" className="cursor-pointer w-full flex items-center justify-end relative" onClick={() => setProfile(!profile)}>
                                            {profile ? (
                                                <ul className="p-2 w-40 border-r bg-white absolute rounded z-40 left-0 shadow mt-64 ">
                                                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                                                        <div className="flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                                <circle cx={12} cy={7} r={4} />
                                                                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                                            </svg>
                                                            <span className="ml-2">My Profile</span>
                                                        </div>
                                                    </li>
                                                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-help" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" />
                                                            <circle cx={12} cy={12} r={9} />
                                                            <line x1={12} y1={17} x2={12} y2="17.01" />
                                                            <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" />
                                                        </svg>
                                                        <span className="ml-2">Help Center</span>
                                                    </li>
                                                    <li className="cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-2 py-2 hover:text-indigo-700 flex items-center focus:text-indigo-700 focus:outline-none">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-settings" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" />
                                                            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <circle cx={12} cy={12} r={3} />
                                                        </svg>
                                                        <span className="ml-2">Account Settings</span>
                                                    </li>
                                                </ul>
                                            ) : (
                                                ""
                                            )}
                                            <img className="rounded h-10 w-10 object-cover" src="https://tuk-cdn.s3.amazonaws.com/assets/components/boxed_layout/bl_1.png" alt="logo" />
                                            <p className="text-gray-800 text-sm ml-2">Jane Doe</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </nav>
                    <div className="container mx-auto px-6 my-6">
                        <div className="w-full border-2 border-gray-300 min-h-[80vh]">
                            {/* Place your content here */}
                            { props.children }
                        </div>
                    </div>
                </div>
        }
        </>
    );
}

export default PageLayout;