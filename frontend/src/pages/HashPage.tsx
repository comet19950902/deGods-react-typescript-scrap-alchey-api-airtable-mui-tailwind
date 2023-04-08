import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    IconButton,
    Pagination,
    Stack,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { TxDetailContext } from "../context/TxDetailContext";

import { BASE_URL, HASH } from '../others/dataTypes';
import ReactLoading from "react-loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: "bold",
    textAlign: 'center',
}));

const HashPage = () => {
    const navigate = useNavigate();
    const { setTxData } = useContext( TxDetailContext );
    const [hashes, setHashes] = useState<HASH[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hashPerPage, setHashPerPage] = useState<number>(10);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Get current hashes
    const indexOfLastHash = currentPage * hashPerPage;
    const indexOfFirstHash = indexOfLastHash - hashPerPage;
    const filteredHashes = hashes.filter((hash) =>
        hash.txHash.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentHashes = filteredHashes.slice(indexOfFirstHash, indexOfLastHash);

    // Change page
    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleRowClick = async(selectedRow: HASH) => {
        try {
            setLoading(true);

            const { data } = await axios.get( `${BASE_URL}/tx/`, { params: { tx: selectedRow.txHash, tokenId: selectedRow.tokenId } });
            const result = data.data;

            setTxData( result );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            navigate(`/tx`);
        }
    }

    useEffect(() => {
        const fetchHashes = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/hashes`);
                setHashes(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchHashes();
    }, []);

    return (
        <div className="pb-[30px]">
            <Stack direction="row" justifyContent="flex-end" marginBottom={3} marginTop={10} >
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search Transaction Hash"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{backgroundColor: '#f1f1f1', height: '70px'}}>
                            <StyledTableCell>Transaction Hash</StyledTableCell>
                            <StyledTableCell>Token ID</StyledTableCell>
                            <StyledTableCell>From</StyledTableCell>
                            <StyledTableCell>To</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            loading 
                            ?
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <div className='flex justify-center'>
                                            <ReactLoading type = "bubbles" color="#0000ff" height={'20%'} width={'20%'} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            :

                                currentHashes && currentHashes.length >0
                                ?
                                    currentHashes.map((hash, index) => (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={index}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => handleRowClick(hash)}
                                        >
                                            <TableCell align="center">
                                                <Typography variant="subtitle1" className="font-semibold text-right px-2">
                                                    {hash.txHash}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right" >{ hash.tokenIdPrt }</TableCell>
                                            <TableCell align="center">{ hash.from }</TableCell>
                                            <TableCell align="center">{ hash.to }</TableCell>
                                        </TableRow>
                                    ))
                                :
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <div className='flex justify-center'>
                                                <ReactLoading type = "bubbles" color="#0000ff" height={'20%'} width={'20%'} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="pt-[20px] flex justify-end">
                <Pagination
                    count={Math.ceil(filteredHashes.length / hashPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    size="large"
                    siblingCount={1}
                    boundaryCount={1}
                />
            </div>
        </div>
    );
};

export default HashPage;