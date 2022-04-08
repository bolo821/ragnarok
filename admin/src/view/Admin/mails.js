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
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody, AuthButton, AdminTextField } from '../../components/adminlayout/LayoutItem';
import { getUsers, sendMailByAdmin } from '../../actions/user';

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

function Mails() {
    const dispatch = useDispatch();
    const users = useSelector(state => state.user);
    const { userlist } = users;
    const [ usermail, setUserMail ] = useState(null);
    const [ sendMail, setSendMail ] = React.useState(false);
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');

    const [ page, setPage ] = React.useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        dispatch(getUsers());
    }, [ dispatch ])

    const handleMail = (email) => {
        setUserMail(email);
        setSendMail(true);
    }
    const handleMailClose = () => { setSendMail(false); setContent(''); setTitle('') }
    const handleSend = () => {
        dispatch(sendMailByAdmin(usermail, title, content));
    }

    let displayusers = userlist.slice((page - 1) * 10, page * 10);
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
                                                            <StyledTableCell align="center">
                                                                <AuthButton variant='outlined' fullWidth onClick={() => handleMail(item.email)}>
                                                                    Send to Mail
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
                    open={sendMail}
                    onClose={handleMailClose}
                    aria-labelledby='keep-mounted-modal-title'
                    aria-describedby='keep-mounted-modal-description'
                >
                    <Box sx={modalstyle}>
                        <Grid container>
                            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                                <Typography variant='h5'>
                                    Send Mail
                                </Typography>
                                <Typography variant='p'>
                                    Mail Address : {usermail}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                                <AdminTextField fullWidth label='Title' size='small' required type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
                            <AdminTextField fullWidth label='Content' size='small' required type='text' value={content} onChange={(e) => setContent(e.target.value)} />
                                
                            </Grid>
                            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
                                <AuthButton variant='outlined' fullWidth onClick={handleSend}>
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

export default Mails;