import React, { useEffect } from 'react';
import { connect } from 'react-redux';
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
import { styled } from '@mui/material/styles';
import { setAlert } from '../../actions/alert';
import { getLogs } from '../../actions/logs';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import { getTokenBalances } from '../../actions/balance';

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




function Transactions({ auth, logs, balances, setAlert, getLogs, getTokenBalances }) {
    const { user, isAuthenticated } = auth;
    const { loglist } = logs;
    const ymirlogs = loglist.filter(m => m.type === 'YMIR');
    const roklogs = loglist.filter(m => m.type === 'ROK');

    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        getLogs();
    }, [getLogs])


    if (isAuthenticated) {
        if (user) {
            if (user.verify === 0) {
                return <Redirect to="/emailverification" />;
            }
        }
    }

    let displayymirs = ymirlogs.slice((page - 1) * 10, page * 10);
    let displayroks = roklogs?.slice((page - 1) * 10, page * 10);
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
                                    <Stack>
                                        <Typography component='h5' variant='h5' sx={{ mb: 3 }}>YMIR</Typography>
                                    </Stack>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>Transaction Url</StyledTableCell>
                                                    <StyledTableCell>TYPE</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    displayymirs ? displayymirs.map((item, i) => (
                                                        <StyledTableRow key={i}>
                                                            <StyledTableCell component="th" scope="row">
                                                                <a href={'https://testnet.bscscan.com/tx/' + item.hash} target='_blank' rel="noreferrer">
                                                                    {item.hash}
                                                                </a>
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row">
                                                                {item.type}
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
                                count={Math.ceil(displayymirs.length / 10)}
                                page={page}
                                onChange={handleChange}
                                color='primary'
                                size='large'
                                sx={{
                                    marginTop: '20px'
                                }}
                            />
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                >
                                    <Stack>
                                        <Typography component='h5' variant='h5' sx={{ mb: 3 }}>ROK</Typography>
                                    </Stack>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>Transaction Url</StyledTableCell>
                                                    <StyledTableCell>TYPE</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    displayroks ? displayroks.map((item, i) => (
                                                        <StyledTableRow key={i}>
                                                            <StyledTableCell component="th" scope="row">
                                                                <a href={'https://testnet.bscscan.com/tx/' + item.hash} target='_blank' rel="noreferrer">
                                                                    {item.hash}
                                                                </a>
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row">
                                                                {item.type}
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
                                count={Math.ceil(displayroks.length / 10)}
                                page={page}
                                onChange={handleChange}
                                color='primary'
                                size='large'
                                sx={{
                                    marginTop: '20px'
                                }}
                            />
                        </DashboardBody>
                    </AdminMainBody>
                </AdminBody>
            </AdminLayout>
        </>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    logs: state.logs,
    balances: state.balance
});

export default connect(mapStateToProps, { setAlert, getLogs, getTokenBalances })(Transactions);