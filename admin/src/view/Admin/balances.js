/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import { getTokenBalances, getTokenFunds } from '../../actions/balance';
import { getUsers } from '../../actions/user';
import { ymiraddress, rokaddress } from '../../config';
import { useContract } from '../../hooks/useContract';
import YMIRABI from '../../services/abis/YMIR.json';
import ROKABI from '../../services/abis/ROK.json';
import { getBalanceAmount } from '../../utils/formatBalance';
import { SET_LOADER } from '../../actions/types';

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
    '&:hover': {
        cursor: 'pointer',
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
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

function Balances() {
    const history = useHistory();
    const dispatch = useDispatch();
    const balances = useSelector(state => state.balance);
    const users = useSelector(state => state.user.userlist);
    const ymirContract = useContract(ymiraddress, YMIRABI);
    const rokContract = useContract(rokaddress, ROKABI);
    const [ search, setSearch ] = useState('');

    const { ymirlist, roklist, ymirfundlist, rokfundlist } = balances;

    const [page, setPage] = useState(1);
    const [ walletBalances, setWalletBalances ] = useState([]);
    const [ displayData, setDisplayData ] = useState([]);
    const [ filteredData, setFilteredData ] = useState([]);

    const [ prevSort, setPrevSort ] = useState('');
    const [ count, setCount ] = useState(0);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(getUsers());
        dispatch(getTokenBalances('YMIR', history));
        dispatch(getTokenBalances('ROK', history));
        dispatch(getTokenFunds('YMIR', history));
        dispatch(getTokenFunds('ROK', history));
    }, [ dispatch ]);

    useEffect(() => {
        dispatch({ type: SET_LOADER, payload: true });
        const getWalletBalances = async users => {
            let data = [];
            for (let i=0; i<users.length; i++) {
                if (users[i].wallet) {
                    try {
                        const resymir = await ymirContract._walletBalance(users[i].wallet);
                        const resrok = await rokContract._walletBalance(users[i].wallet);
                        let amountymir = getBalanceAmount(resymir);
                        let amountrok = getBalanceAmount(resrok);
                        data.push({
                            account_id: users[i].account_id,
                            email: users[i].email,
                            wallet: users[i].wallet,
                            userid: users[i].userid,
                            ymir: amountymir,
                            rok: amountrok,
                        });
                    } catch (err) {
                        console.log('error:', err);
                        continue;
                    }
                }
            }
            setWalletBalances(data);
            dispatch({ type: SET_LOADER, payload: false });
        }

        if (users.length) {
            getWalletBalances(users);
        }
    }, [ users ]);

    useEffect(() => {
        let data = [];
        let ymirjson = produceJson(ymirlist);
        let ymirfundjson = produceJson(ymirfundlist);
        let rokjson = produceJson(roklist);
        let rokfundjson = produceJson(rokfundlist);
        
        for (let i=0; i<walletBalances.length; i++) {
            let ele = {
                email: walletBalances[i].email,
                userid: walletBalances[i].userid,
                wallet: walletBalances[i].wallet,
                ymir: ymirjson[[walletBalances[i].account_id]] ? ymirjson[[walletBalances[i].account_id]].balance : 0,
                ymirfund: ymirfundjson[[walletBalances[i].account_id]] ? ymirfundjson[[walletBalances[i].account_id]].balance : 0,
                rok: rokjson[[walletBalances[i].account_id]] ? rokjson[[walletBalances[i].account_id]].balance : 0,
                rokfund: rokfundjson[[walletBalances[i].account_id]] ? rokfundjson[[walletBalances[i].account_id]].balance : 0,
                ymirwallet: parseInt(walletBalances[i].ymir),
                rokwallet: parseInt(walletBalances[i].rok),
            }
            data.push(ele);
        }

        setDisplayData(data);
    }, [ walletBalances ]);

    useEffect(() => {
        setFilteredData(displayData.filter(ele => {
            return ele.email.includes(search) || ele.userid.includes(search);
        }));
    }, [ displayData, search ]);

    const produceJson = arr => {
        let result = {};
        for (let i=0; i<arr.length; i++) {
            result[[arr[i].account_id]] = arr[i];
        }
        return result;
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

    let display = filteredData.slice((page - 1) * 10, page * 10);

    return (
        <>
            {/*<AdminHeader />*/}
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
                                        <Typography component='h5' variant='h5'>TOKEN BALANCES</Typography>
                                        <SearchBox onChange={e => setSearch(e.target.value)} value={search} name="search" placeholder='Search...' />
                                    </Stack>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell onClick={() => sortTable('email')}>Email</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('userid')}>UserID</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('ymir')}>Ymir Balance</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('ymirfund')}>Ymir Fund</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('ymirwallet')}>Ymir Wallet</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('rok')}>Rok Balance</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('rokfund')}>Rok Fund</StyledTableCell>
                                                    <StyledTableCell onClick={() => sortTable('rokwallet')}>Rok Wallet</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    display ? display.map((item, i) => (
                                                        <StyledTableRow key={i}>
                                                            <StyledTableCell component="th" scope="row">
                                                                {item.email}
                                                            </StyledTableCell>
                                                            <StyledTableCell>{item.userid}</StyledTableCell>
                                                            <StyledTableCell>{item.ymir}</StyledTableCell>
                                                            <StyledTableCell>{item.ymirfund}</StyledTableCell>
                                                            <StyledTableCell>{item.ymirwallet}</StyledTableCell>
                                                            <StyledTableCell>{item.rok}</StyledTableCell>
                                                            <StyledTableCell>{item.rokfund}</StyledTableCell>
                                                            <StyledTableCell>{item.rokwallet}</StyledTableCell>
                                                        </StyledTableRow>
                                                    )) : null
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>


                                </Grid>
                            </Grid>
                            <Pagination
                                count={Math.ceil(display.length / 10)}
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

export default Balances;