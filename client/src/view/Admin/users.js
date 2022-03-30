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
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { styled } from '@mui/material/styles';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody, AuthButton } from '../../components/adminlayout/LayoutItem';
import { getUsers, updateUser } from '../../actions/user';

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

const EditButton = styled(Button)(({ theme }) => ({
    background: '#242735',
    color: 'white',
    '&:hover': {
        color: 'black',
        background: '#aaaaaa',
    }
}));

function Users() {
    const dispatch = useDispatch();
    const users = useSelector(state => state.user);
    const { userlist } = users;
    const [page, setPage] = React.useState(1);
    const [ showModal, setShowModal ] = useState(false);
    const [ ban, setBan ] = useState(false);
    const [ user, setUser ] = useState(null);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(getUsers());
    }, [ dispatch ]);

    let displayusers = userlist.slice((page - 1) * 10, page * 10);

    const handleRowClick = user => {
        setShowModal(true);
        setUser(user);
        if (user.state === 0) setBan(false);
        else setBan(true);
    }

    const handleUpdate = () => {
        if (ban && user.state === 0) {
            dispatch(updateUser(user.account_id, 5));
        } else if (!ban && user.state === 5) {
            dispatch(updateUser(user.account_id, 0));
        }
        handleModalClose();
    }

    const handleModalClose = () => {
        setShowModal(false);
        setBan(false);
        setUser(null);
    }

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
                                                    <StyledTableCell>UserID</StyledTableCell>
                                                    <StyledTableCell>Wallet</StyledTableCell>
                                                    <StyledTableCell>Status</StyledTableCell>
                                                    <StyledTableCell>Action</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    displayusers ? displayusers.map((item, i) => (
                                                        <StyledTableRow key={i}>
                                                            <StyledTableCell component="th" scope="row">
                                                                {item.email}
                                                            </StyledTableCell>
                                                            <StyledTableCell>{item.userid}</StyledTableCell>
                                                            <StyledTableCell>{item.wallet}</StyledTableCell>
                                                            <StyledTableCell>{item.state === 0 ? 'Active' : item.state === 5 ? 'Baned' : ''}</StyledTableCell>
                                                            <StyledTableCell>
                                                                <EditButton onClick={ () => handleRowClick(item) }>Edit</EditButton>
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
                                    marginTop: '20px'
                                }}
                            />
                        </DashboardBody>
                    </AdminMainBody>
                </AdminBody>
            </AdminLayout>
            <Modal
                keepMounted
                open={showModal}
                onClose={handleModalClose}
                aria-labelledby='keep-mounted-modal-title'
                aria-describedby='keep-mounted-modal-description'
            >
                <Box sx={modalstyle}>
                    <Grid container>
                        <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <Typography variant='h5' sx={{textAlign: 'center'}}>
                                Change User Settings
                            </Typography>
                            <Grid sx={{ mt: 2 }}>
                                <input
                                    type="checkbox"
                                    name="ban"
                                    id="ban"
                                    checked={ban}
                                    onChange={e => { setBan(e.target.checked) }}
                                />
                                <Typography variant="label" sx={{ ml: 1 }}>
                                    Ban this account.
                                </Typography>
                            </Grid> 
                        </Grid>
                        <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                            <AuthButton variant='outlined' fullWidth={true} onClick={handleUpdate}>
                                Update
                            </AuthButton>
                        </Stack>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}

export default Users;