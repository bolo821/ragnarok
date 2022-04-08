import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { getAllLogs } from '../../actions/logs';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';

const DashboardBody = styled(Box)(({ theme }) => ({
    padding: '26px',
    paddingBottom: '0',
    color: '#F5F6F9',
    height: 'calc(100% - 50px)',
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    a: {
        color: 'black',
    },
    '&:hover': {
        cursor: 'pointer',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const SearchBox = styled(TextField)(({ theme }) => ({
    '& input': {
        background: 'rgba(224, 224, 224, 1)',
        borderRadius: '2rem',
        padding: '0.7rem 1.2rem',
    },
}));

const getDateString = in_date => {
    let date = new Date(in_date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    return `${year}-${month}-${day}`;
}

const getTimeString = in_date => {
    let date_str = getDateString(in_date);
    let date = new Date(in_date);
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) hour = `0${minute}`;
    if (second < 10) second = `0${second}`;

    return `${date_str} ${hour}:${minute}:${second}`;
}

function TransactionsRok() {
    const dispatch = useDispatch();
    const logs = useSelector(state => state.logs);
    const { logAll } = logs;

    const [ page, setPage ] = useState(1);
    const [ displayData, setDisplayData ] = useState([]);
    const [ filteredData, setFilteredData ] = useState([]);
    const [ search, setSearch ] = useState('');
    const [ prevSort, setPrevSort ] = useState('');
    const [ count, setCount ] = useState(0);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(getAllLogs());
    }, [ dispatch ]);

    useEffect(() => {
        const ymirlogs = logAll.filter(m => m.type === 'ROK');
        setDisplayData(ymirlogs);
    }, [ logAll ]);

    const getTransactionType = message => {
        if (message.includes('You attempted to deposit')) {
            return 'Deposit to web wallet';
        } else if (message.includes('You attempted to withdraw')) {
            return 'Withdraw to metamask';
        } else if (message.includes('You attempted to claim')) {
            return 'Claim tokens';
        } else {
            return 'Transfer to game';
        }
    }

    const sortTable = by => {
        setPrevSort(by);
        let temp = [ ...displayData ];
        temp.sort((a, b) => {
            if (prevSort === by) {
                setCount(count + 1);
                if (count % 2) {
                    return a[[by]] > b[[by]] ? 1 : -1;
                } else {
                    return a[[by]] < b[[by]] ? 1 : -1;
                }
            } else {
                setCount(0);
                return a[[by]] > b[[by]] ? 1 : -1;
            }
        });
        setDisplayData(temp);
    }

    useEffect(() => {
        setFilteredData(displayData.filter(ele => {
            let lSearch = search.toLowerCase();
            return ele.userid.toLowerCase().includes(lSearch) || ele.wallet.toLowerCase().includes(lSearch) || ele.hash.toLowerCase().includes(lSearch);
        }));
    }, [ displayData, search ]);

    let displayroks = filteredData.slice((page - 1) * 10, page * 10);

    return (
        <>
            <AdminLayout>
                <AdminBody direction='row'>
                    <Sidebar />
                    <AdminMainBody>
                        <DashboardBody justifyContent='center'>
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Stack direction='row' alignItems={'center'} justifyContent="space-between" sx={{ mb: 2 }}>
                                        <Typography component='h5' variant='h5'>ROK</Typography>
                                        <SearchBox onChange={e => setSearch(e.target.value)} value={search} name="search" placeholder='Search...' />
                                    </Stack>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell onClick={() => sortTable('userid')}>User Id</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('amount')}>Amount</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('wallet')}>Wallet</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('message')}>Transaction Type</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('date')}>Transaction Date</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('hash')}>Transaction Hash</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    displayroks ? displayroks.map((item, i) => (
                                                        <StyledTableRow key={i}>
                                                            <StyledTableCell component="td" scope="row">{ item.userid }</StyledTableCell>
                                                            <StyledTableCell component="td" scope="row">{ item.amount }</StyledTableCell>
                                                            <StyledTableCell component="td" scope="row">{ item.wallet }</StyledTableCell>
                                                            <StyledTableCell component="td" scope="row">
                                                                { getTransactionType(item.message) }
                                                            </StyledTableCell>
                                                            <StyledTableCell component="td" scope="row">{ getTimeString(item.date) }</StyledTableCell>
                                                            <StyledTableCell component="td" scope="row">
                                                                <a href={'https://testnet.bscscan.com/tx/' + item.hash} target='_blank' rel="noreferrer">
                                                                    { item.hash }
                                                                </a>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    )) : null
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>


                                </Grid>
                            </Grid>
                            <Pagination
                                count={Math.ceil(filteredData.length / 10)}
                                page={page}
                                onChange={handleChange}
                                color='primary'
                                size='large'
                                sx={{
                                    marginTop: '20px',
                                    '& button': {
                                      color: 'white'
                                    },
                                    '& li div': {
                                        color: 'white'
                                    }
                                }}
                            />
                        </DashboardBody>
                    </AdminMainBody>
                </AdminBody>
            </AdminLayout>
        </>
    );
}

export default TransactionsRok;