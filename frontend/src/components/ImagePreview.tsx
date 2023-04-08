import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const renderImage = (logoUrl: string, name: string) => {
    return (
        <div style={{ margin:0, display:"flex"}}>
            <img src={ logoUrl } alt="NFT Image" style={{ width: "40px", borderRadius: "100%" }} />
            <p style={{ marginLeft: 10 }}>
                { name }
            </p>
        </div>
    )
};

export default renderImage;