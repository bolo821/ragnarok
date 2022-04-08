import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
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
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody, AuthButton, AdminTextField } from '../../components/adminlayout/LayoutItem';
import { getUsers, sendCoinByAdmin } from '../../actions/user';

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
const modalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



function Tokens() {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const users = useSelector(state => user);
    const { user, isAuthenticated } = auth;
    const { userlist } = users;
    const [mail, setMail] = useState(null);
    const [openCoin, setOpenCoin] = React.useState(false);
    const [id, setId] = useState(0);
    const [type, setType] = useState('YMIR');
    const [amount, setAmount] = useState(0);
    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(getUsers());
    }, [ dispatch ])


    if (isAuthenticated) {
        if (user) {
            if (user.verify === 0) {
                return <Redirect to="/emailverification" />;
            }
        }
    }

    const handleMail = (account_id, email, type) => {
        setId(account_id);
        setMail(email);
        setType(type);
        setOpenCoin(true);
    }
    const handleMailClose = () => { setOpenCoin(false); setAmount(0) }
    const handleSend = () => {
        dispatch(sendCoinByAdmin(id, amount, type));
    }

    let displayusers = userlist.filter(m => m.group_id === 0).slice((page - 1) * 10, page * 10);
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
                                    <Stack>
                                        <Typography component='h5' variant='h5' sx={{ mb: 3 }}>Users</Typography>
                                    </Stack>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>Email</StyledTableCell>
                                                    <StyledTableCell>Wallet</StyledTableCell>
                                                    <StyledTableCell align="center"></StyledTableCell>
                                                    <StyledTableCell align="center"></StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    displayusers ? displayusers.map((item, i) => (
                                                        <StyledTableRow key={i}>
                                                            <StyledTableCell component="th" scope="row">
                                                                {item.email}
                                                            </StyledTableCell>
                                                            <StyledTableCell>
                                                                {item.wallet}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <AuthButton variant='outlined' fullWidth onClick={() => handleMail(item.account_id, item.email, 'YMIR')}>
                                                                    Send YMIR
                                                                </AuthButton>
                                                            </StyledTableCell>
                                                            <StyledTableCell align="center">
                                                                <AuthButton variant='outlined' fullWidth onClick={() => handleMail(item.account_id,  item.email, 'ROK')}>
                                                                    Send ROK
                                                                </AuthButton>
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
                                count={Math.ceil(displayusers.length / 10)}
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
                <Modal
                    keepMounted
                    open={openCoin}
                    onClose={handleMailClose}
                    aria-labelledby='keep-mounted-modal-title'
                    aria-describedby='keep-mounted-modal-description'
                >
                    <Box sx={modalstyle}>
                        <Grid container>
                            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                                <Typography variant='h5'>
                                    Send {type}
                                </Typography>
                                <Typography variant='p'>
                                    Mail Address : {mail}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                                <AdminTextField fullWidth label='Title' size='small' required type='number' value={amount} onChange={(e) => setAmount(e.target.value)} />
                            </Grid>
                            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                                <AuthButton variant='outlined' fullWidth onClick={() => handleSend()}>
                                    Send
                                </AuthButton>
                            </Stack>
                        </Grid>
                    </Box>
                </Modal>
            </AdminLayout>
        </>
    );
}

export default Tokens;