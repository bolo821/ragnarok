import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AdminTextField } from '../../components/adminlayout/LayoutItem';
import { openModal } from '../../actions/modal';
import { styled } from '@mui/material/styles';
import {useWeb3React} from '@web3-react/core';
import { registerSubaccount, getSubaccounts, changePassword, forgotpassword } from '../../actions/auth';
import Sidebar from './adminSidebar';
import { updateContractBalance } from '../../actions/ymirBalance';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import { toast } from 'react-toastify';

const AuthButton = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  width: '200px',
  height: '40px',
  border: '1px solid #fff',
  backgroundColor: '#242735',
  color: 'white',
  fontWeight: 600
}));

const TableButton = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  height: '30px',
  backgroundColor: '#1c4f9c',
  color: 'white',
  fontWeight: 600
}));

const style1 = {
  width: '80%',
  mx: 'auto',
  py: 4,
  px: {
    sm: 4,
    xs: 1
  },
  marginBottom: '20px',
  borderRadius: '10px',
  border: '1px solid #fff',
  marginTop: '100px'
};

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

function AccountManagement() {
  const auth = useSelector(state => state.auth);
  const balance = useSelector(state => state.balance);
  const ymir = useSelector(state => state.ymir);
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const { user, users } = auth;
  const [ flag, setFlag ] = useState(true);

  const [formData, setFormData] = useState({
    userid: '',
    password: '',
    password2: '',
    currentpassword: '',
  });

  const [ account_id, setAccountID ] = useState('');
  const [ account_name, setAccountName ] = useState('');

  const { userid, password, password2, currentpassword } = formData;
  const [ withdraw, setWithdraw ] = useState(0);
  const [ deposit, setDeposit ] = useState(0);
  const { contractBalance } = ymir;
  const { sub } = balance;
  const [ addmodal, setAddModal ] = React.useState(false);
  const [ managemodal, setManageModal ] = React.useState(false);
  const [ passwordmodal, setPasswordModal ] = React.useState(false);

  const handleAddOpen = () => setAddModal(true);
  const handleAddClose = () => setAddModal(false);

  const handlePasswordOpen = () => setPasswordModal(true);
  const handlePasswordClose = () => setPasswordModal(false);
  const handleManageClose = () => setManageModal(false);

  const Deposit = async () => {
    if(window.confirm("You are trying to deposit "+ deposit+" Ymir Coin. Click confirm to proceed.")) {
      try {
        if(deposit <= 0) {
          toast.warn('Please Input token Balance again.');
          return;
        }
        if(deposit > contractBalance) {
          toast.warn('Please Input correct token Balance.');
          return;
        }
        handleManageClose()

        let masterdata = {
          token: 'YMIR',
          newvalue: contractBalance - Number(deposit),
          currentvalue: contractBalance,
          message : `You attempted to withdraw ${deposit} Ymir Coins`,
          account_id : user.account_id
        }
        dispatch(updateContractBalance(masterdata, user.account_id));

        let subdata = {
          token: 'YMIR',
          newvalue: sub + Number(deposit),
          currentvalue: sub,
          message : `You attempted to deposit ${deposit} Ymir Coins`,
          account_id : account_id
        }
        dispatch(updateContractBalance(subdata, account_id));
        setDeposit(0);
        dispatch(openModal(true, `Deposit from Metamask. ${deposit} Ymir Coin was successfully deposited into your game account wallet.`));
      } catch (err) {
        handleManageClose()
        console.log(err)
        toast.error('Something went wrong.');
      }
      localStorage.removeItem('YMIR_action');
    }
  }

  const Withdraw = async () => {
    if(window.confirm("You are trying to deposit "+ withdraw+" Ymir Coin. Click confirm to proceed.")) {
      try {
        if(withdraw <= 0 || sub < withdraw) {
          toast.warn('Please Input token Balance again.');
          return;
        }
        handleManageClose();
        let masterdata = {
          token: 'YMIR',
          newvalue: contractBalance + Number(withdraw),
          currentvalue: contractBalance,
          account_id : user.account_id
        }

        dispatch(updateContractBalance(masterdata, user.account_id));

        let subdata = {
          token: 'YMIR',
          newvalue: sub - Number(withdraw),
          currentvalue: sub,
          account_id : account_id
        }
        dispatch(updateContractBalance(subdata, account_id));
       
        setWithdraw(0);
        dispatch(openModal(true, `Withdraw to Metamask. ${withdraw} Ymir Coin was successfully withdrawn from your game account wallet.`));
      } catch(err) {
        handleManageClose();
        console.log(err);
        toast.error('Something went wrong.');
      }
    }
  }


  const onChange = (e) => {
    if (e.target.name === "userid" && e.target.value !== '') {
      if (e.target.value.match(/\W/)) {
        if (flag) {
          toast.warn('Do not write the special character.');
          setFlag(false);
        }
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validateNameLength = () => {
    return userid.length >= 4 && userid.length <= 15;
  }

  // Register sub user.
  const onRegister = async (e) => {
    e.preventDefault();
    if (!account) {
      toast.warn('Please connect to your wallet');
    }
    if (password !== password2) {
      toast.warn('Passwords do not match');
    } else if (!validateNameLength()) {
      toast.warn('Name length should be between 4 and 15.');
    } else {
      dispatch(registerSubaccount({ userid, password, wallet: account }));
      handleAddClose();
    }
    setFormData({
      userid: '',
      password: '',
      password2: ''
    })
  };

  const onPassword = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.warn('Passwords do not match');
    } else {
      dispatch(changePassword({ password2, password, currentpassword, account_id, account_name, parent_user_id: user.account_id }));
      setFormData({
        ...formData,
        currentpassword: '',
        password: '',
        password2: ''
      })
      setAccountID('');
      handlePasswordClose()
    }
  };

  useEffect(() => {
    dispatch(getSubaccounts());
    setFlag(true);
  }, [ dispatch ])

  return (
    <>
      <AdminLayout>
        <AdminBody direction='row'>
          <Sidebar />
          <AdminMainBody>
            <Box sx={style1}>
              <AuthButton
                fullWidth
                sx={{width: '150px', mb: 2}}
                onClick={handleAddOpen}
              >
                Add Account
              </AuthButton>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650, textTransform: 'initial' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>UserName</TableCell>
                      <TableCell>Account ID</TableCell>
                      <TableCell>Last Login</TableCell>
                      <TableCell>Password</TableCell>
                     
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users && users
                    // .filter(m => m.master !== null)
                    .map((row, i) => (
                      <TableRow
                        key={i}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.userid}
                        </TableCell>
                        <TableCell>
                          {row.account_id}
                        </TableCell>
                        <TableCell>
                        </TableCell>
                        <TableCell>
                          <TableButton
                            variant="outlined"
                            sx={{width: '100px'}}
                            onClick={() =>  {setAccountID(row.account_id); setAccountName(row.userid); handlePasswordOpen();}}
                          >
                            Change
                          </TableButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </AdminMainBody>
        </AdminBody>

        <Modal
          keepMounted
          open={addmodal}
          onClose={handleAddClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={modalstyle}>
            <form onSubmit={onRegister}>
              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography sx={{mr: '10px'}} align='right' color='#1c4f9c' fontWeight={600} variant="h6" component="h3">
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Username" size='small' required name="userid" value={userid} onChange={onChange} disabled={!account} autoComplete="off" />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography sx={{mr: '10px'}} align='right' color='#1c4f9c' fontWeight={600} variant="h6" component="h3">
                    Password
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Password" size='small' required type='password' name="password" value={password} onChange={onChange} disabled={!account} autoComplete="off" />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3} sx={{py: {lg: 2, sm: 1, xs: 0}}} display='flex' alignItems='center' justifyContent='end'>
                  <Typography sx={{mr: '10px'}} align='right' color='#1c4f9c' fontWeight={600} variant="h6" component="h3">
                    Confirm
                  </Typography>
                </Grid>
                <Grid item xs={9} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField fullWidth label="Confirm Password" size='small' required type='password' disabled={!account} name="password2" value={password2} onChange={onChange} autoComplete="off" />
                </Grid>
                <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
                  <AuthButton type='submit' disabled={!account}>
                    Create Sub
                  </AuthButton>
                </Stack>
              </Grid>
            </form>
          </Box>
        </Modal>
        <Modal
          keepMounted
          open={passwordmodal}
          onClose={handlePasswordClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={modalstyle}>
            <form onSubmit={onPassword}>
              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField
                    fullWidth
                    label='Current Password'
                    size='small'
                    type='password'
                    name='currentpassword'
                    value={currentpassword}
                    onChange={onChange}
                    autoComplete="off"
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    style={{color: '#1c4f9c', cursor: 'pointer'}}
                    onClick={() => {
                      dispatch(forgotpassword({account_id}));
                      handlePasswordClose();
                    }}
                  >
                    Forgot Password?
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField
                    fullWidth
                    label='Password'
                    size='small'
                    type='password'
                    name='password'
                    value={password}
                    onChange={onChange}
                    autoComplete="off"
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                  <TextField
                    fullWidth
                    label='Confirm Password'
                    size='small'
                    type='password'
                    disabled={!account}
                    name='password2'
                    value={password2}
                    onChange={onChange}
                    autoComplete="off"
                  />
                </Grid>
                <Stack alignItems={{xs: 'center', width: '100%'}}>
                  <AuthButton type='submit' variant="outlined">
                    Change Password
                  </AuthButton>
                </Stack>
              </Grid>
            </form>
          </Box>
        </Modal>
        <Modal
          keepMounted
          open={managemodal}
          onClose={handleManageClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={modalstyle}>
            <Grid container>
              <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                <Typography variant='h5'>
                  Manage Sub Account
                </Typography>
                <Typography variant='p'>
                  Widthraw Max Amount : {sub}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                <AdminTextField fullWidth label='Balance' size='small' required type='number' value={withdraw} onChange={(e) => setWithdraw(e.target.value)} autoComplete="off" />
              </Grid>
              <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
                <AuthButton variant='outlined' fullWidth onClick={() => Withdraw()}>
                  Withdraw
                </AuthButton>
              </Stack>
            </Grid>
            <Grid container>
              <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
                <Typography variant='p'>
                  Master Account Balance : {contractBalance}
                </Typography>
              </Grid>
            <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}}}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={deposit} onChange={(e) => setDeposit(e.target.value)} autoComplete="off" />
            </Grid>
            <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={()=> Deposit()}>
                Deposit
              </AuthButton>
            </Stack>
          </Grid>
          </Box>
        </Modal>
    	</AdminLayout>
    </>
  );
}

export default AccountManagement;