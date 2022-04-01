/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import { setAlert } from '../../../actions/alert';
import { updateTempBalance, updateContractBalance, getWalletBalance, getContractBalance, updateFunndBalance, getAccountBalance } from '../../../actions/ymirBalance';
import { setTverify, transactionverify, resend } from '../../../actions/auth';
import { openModal } from '../../../actions/modal';
import { ymiraddress, minterAddress } from '../../../config';
import { useContract } from '../../../hooks/useContract';
import { getMinterContract } from '../../../utils/contracts';
import YMIRABI from '../../../services/abis/YMIR.json';
import { useWeb3React } from '@web3-react/core';
import { AuthButton, AdminTextField, VerifyTextfieldWrap, VerifyTextfield, VerifyButton, formstyle } from '../../../components/adminlayout/LayoutItem';
import CountDown from '../../../components/CountDown';
import { getDecimalAmount } from '../../../utils/formatBalance';
import { verifyNumberByDecimal } from '../../../utils/helper';

const DepositButton = styled(Button)(({ theme }) => ({
  height: '30px',
  fontSize: '11px',
  backgroundColor: '#242735',
  border: '1px solid #F5F6F9',
  color: 'white',
  margin: '4px 0'
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

function YMIRTransaction() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { user, transaction_verify } = auth;
  const balance = useSelector(state => state.ymir);

  const { account } = useWeb3React();
  const { contractBalance, walletBalance, fundBalance } = balance;
  const ymirContract = useContract(ymiraddress, YMIRABI);
  
  const [deposit, setDeposit] = useState(0);
  const [widthraw, setWidthraw] = useState(0);
  const [withdrawFund, setWithdrawFund] = useState(0);
  const [code, setCode] = useState('');
  const [flag, setFlag] = useState(false);
  const [depositmodal, setDepositmodal] = useState(false);
  const [withdrawmodal, setWithdrawmodal] = useState(false);
  const [depositFundmodal, setDepositFundmodal] = useState(false);
  const [withdrawFundmodal, setWithdrawFundmodal] = useState(false);
  const [verifymodal, setVerifymodal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(getWalletBalance(ymirContract, account));
      dispatch(getContractBalance(ymirContract, account));
      dispatch(getAccountBalance(user.account_id));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const onVerify = async (e) => {
    e.preventDefault();
    dispatch(transactionverify(code, handleVerifyClose));
  };

  const handleDepositOpen = () => {
    setDepositmodal(true);
  }

  const handleDepositClose = () => {
    setDepositmodal(false)
  };

  const handleWithdrawOpen = () => {
    if (!transaction_verify) {
      handleVerifyOpen();
      return;
    }
    setWithdrawmodal(true);
  }

  const handleWithdrawClose = () => setWithdrawmodal(false);
  const handleDepositFundOpen = () => setDepositFundmodal(true);
  const handleDepositFundClose = () => setDepositFundmodal(false);
  const handleWithdrawFundOpen = () => setWithdrawFundmodal(true);
  const handleWithdrawFundClose = () => setWithdrawFundmodal(false);
  const handleVerifyOpen = () => setVerifymodal(true);
  const handleVerifyClose = () => setVerifymodal(false);

  useEffect(() => {
    if (transaction_verify) {
      handleWithdrawOpen();
    }
  }, [ transaction_verify ]);

  // Function for deposit Ymir token (Bolo)
  const DepositYMIR = async () => {
    if (window.confirm("You are trying to deposit " + deposit + " Ymir Coin. Click confirm to proceed.")) {
      try {
        if (deposit <= 0) {
          dispatch(setAlert('Please Input token Balance again.', 'warning'));
          return;
        }
        if (parseFloat(deposit) > parseFloat(walletBalance)) {
          dispatch(setAlert('The current token amount is exceeding your balance.', 'warning'));
          return;
        }
        if (!verifyNumberByDecimal(deposit, 18)) {
          dispatch(setAlert('The number is exceeding the decimal.', 'warning'));
          return;
        }
        
        dispatch(setAlert('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.', 'warning', 10000));
        handleDepositClose();

        dispatch({ type: 'SET_LOADER', payload: true });

        // SOCKET.emit('START_TRANSACTION', user.account_id, async (can_start) => {
        //   if (can_start) {
            let txHash = await ymirContract.deposit(getDecimalAmount(deposit));
            let confirmation = await txHash.wait();
    
            let data = {
              token: 'YMIR',
              hash: txHash.hash,
              account_id: user.account_id
            }
    
            if (confirmation.status === 1) {
              data.amount = parseFloat(deposit);
              data.message = `You attempted to deposit ${deposit} Ymir Coins from your Metamask Wallet.`;
            } else {
              data.amount = deposit;
              data.message = `Your deposit attempt from Metamask Wallet has failed.`;
            }
    
            dispatch(updateTempBalance(data, user.account_id));
            dispatch(setTverify(false));
            setDeposit(0);
            dispatch({ type: 'SET_LOADER', payload: false })
            dispatch(openModal(true, `Deposit from Metamask. ${deposit} Ymir Coin was successfully deposited into your game account wallet.`));

        //     SOCKET.emit('END_TRANSACTION', user.account_id);
        //   } else {
        //     dispatch(setAlert('Please finish the current transaction and try again.', 'danger'));
        //     dispatch({ type: 'SET_LOADER', payload: false })
        //   }
        // });
      } catch (err) {
        handleDepositClose()
        dispatch({ type: 'SET_LOADER', payload: false })
        dispatch(setAlert('Something went wrong.', 'error'));
      }
    }
  }

  // Withdraw ymir token (Bolo)
  const withdrawYMIR = async () => {
    if (window.confirm("You are trying to deposit " + widthraw + " Ymir Coin. Click confirm to proceed.")) {
      try {
        if (widthraw <= 0 || parseFloat(contractBalance) < parseFloat(widthraw)) {
          dispatch(setAlert('Please Input token Balance again.', 'warning'));
          return;
        }
        dispatch(setAlert('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.', 'warning', 10000));
        handleWithdrawClose();
        dispatch({ type: 'SET_LOADER', payload: true });

        let txHash = await ymirContract.withdraw(getDecimalAmount(widthraw));
        let confirmation = await txHash.wait();

        let data = {
          token: 'YMIR',
          account_id: user.account_id,
          hash: txHash.hash
        }

        if (confirmation.status === 1) {
          data.amount = Number(widthraw);
          data.message = `You attempted to withdraw ${widthraw} Ymir Coins into your Metamask Wallet.`;
        } else {
          data.amount = widthraw;
          data.message = `Your withdraw attempt into your Metamask Wallet has failed.`;
        }

        dispatch(updateTempBalance(data, user.account_id));
        dispatch(setTverify(false));
        setWidthraw(0);
        dispatch({ type: 'SET_LOADER', payload: false })
        dispatch(openModal(true, `Withdraw to Metamask. ${widthraw} Ymir Coin was successfully withdrawn from your game account wallet.`));
      } catch (err) {
        dispatch({ type: 'SET_LOADER', payload: false })
        handleWithdrawClose();
        console.log(err)
        dispatch(setAlert('Something went wrong.', 'error'));
      }
    }
  }

  // deposit fund function (Bolo)
  const DepositFund = async () => {
    if (window.confirm("You are trying to claim " + fundBalance + " Ymir Coin. Click confirm to proceed.")) {
      try {
        let fundDepositBalance = await dispatch(getAccountBalance(user.account_id));
        if (fundDepositBalance <= 0 ) { 
          dispatch(setAlert('Please Token Balance again.', 'warning'));
          return;
        }
        dispatch(setAlert('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.', 'warning', 10000));
        handleDepositFundClose()
        dispatch({ type: 'SET_LOADER', payload: true })
        
        let data = {
          token: 'YMIR',
          type: 'deposit',
          amount: fundDepositBalance,
          account_id: user.account_id
        }
        let flag = await dispatch(updateContractBalance(data));
        if (flag === true) {
          const ymirMinterContract = await getMinterContract(ymiraddress, YMIRABI);
          let txHash = await ymirMinterContract.methods.WithdrawFromGame(account, getDecimalAmount(fundDepositBalance)).send({ from: minterAddress });
		      data.hash = txHash.transactionHash;
          data.message = `You attempted to claim ${fundDepositBalance} Ymir Coins`;
          dispatch(updateTempBalance(data, user.account_id));
          dispatch(getAccountBalance(user.account_id));
          dispatch({ type: 'SET_LOADER', payload: false });
          dispatch(openModal(true, `Claim Ymir Coins. ${fundDepositBalance} Ymir Coin was successfully claimed from your game account wallet.`));
        } else {
          dispatch({ type: 'SET_LOADER', payload: false })
          dispatch(setAlert('Something went wrong.', 'error'));
        }
      } catch (err) {
        handleDepositFundClose()
        console.log(err)
        dispatch({ type: 'SET_LOADER', payload: false })
        dispatch(setAlert('Something went wrong.', 'error'));
      }
    }
  }

  const WithdrawFund = async () => {
    if (window.confirm("You are trying to transfer " + withdrawFund + " Ymir Coin into your Game Account Wallet. Click confirm to proceed.")) {
      try {
        if (withdrawFund <= 0 || parseFloat(contractBalance) < parseFloat(withdrawFund)) {
          dispatch(setAlert('Please Input token Balance again.', 'warning'));
          return;
        }
        dispatch(setAlert('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.', 'warning', 10000));
        dispatch({ type: 'SET_LOADER', payload: true });
        handleWithdrawFundClose();
        let txHash = await ymirContract.DepositToGame(account, getDecimalAmount(withdrawFund));
        let confirmation = await txHash.wait();
        if (confirmation.status === 1) {
          let data = {
            token: 'YMIR',
            type: 'withdraw',
            amount: withdrawFund,
			      hash : txHash.hash,
            account_id: user.account_id
          }
          let flag = await dispatch(updateFunndBalance(data));

          if (flag === true) {
			      data.message = `You attempted to transfer ${withdrawFund} Ymir Coins into your Game Account Wallet.`;
            dispatch(updateTempBalance(data, user.account_id));
            setWithdrawFund(0);
            dispatch({ type: 'SET_LOADER', payload: false })
            dispatch(openModal(true, `Transfer to Game. ${withdrawFund} Ymir Coin was successfully transfered into your game account wallet.`));
          } else {
            dispatch({ type: 'SET_LOADER', payload: false })
            dispatch(setAlert('Something went wrong.', 'error'));
          }
        } else {
          dispatch({ type: 'SET_LOADER', payload: false })
          dispatch(setAlert('Something went wrong.', 'error'));
        }
      } catch (err) {
        dispatch({ type: 'SET_LOADER', payload: false })
        handleWithdrawFundClose();
        console.log(err)
        dispatch(setAlert('Something went wrong.', 'error'));
      }
    }
  }

  return (
    <Grid item md={6} xs={12} sx={{ px: 1, mb: 2 }}>
      <Stack
        sx={{
          p: 2,
          border: '1px solid #F5F6F9',
          borderRadius: '8px',
          backgroundImage: 'url(/userpanel/bsc.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          backgroundSize: 'contain',
          height: '200px',
        }}
        justifyContent='space-between'
      >
        <Box>
          <Typography component='h5' variant='h5'>Metamask : {walletBalance ? walletBalance : 0} Ymir Coin</Typography>
          <Typography component='h5' variant='h5'>Web Wallet : {contractBalance ? contractBalance : 0} Ymir Coin</Typography>
          <Typography component='h5' variant='h5'>Claimable : {fundBalance ? fundBalance : 0} Ymir Coin</Typography>
        </Box>
        <Stack
          direction={{
            md: 'row',
            xs: 'column'
          }}
          justifyContent='space-between'
        >
          <DepositButton onClick={handleDepositOpen}>Deposit from Metamask</DepositButton>
          <DepositButton onClick={handleWithdrawOpen}>Withdraw to Metamask</DepositButton>
        </Stack>
        <Stack
          direction={{
            md: 'row',
            xs: 'column'
          }}
          justifyContent='space-between'
        >
          <DepositButton onClick={handleDepositFundOpen}>Claim Ymir Coins</DepositButton>
          <DepositButton onClick={handleWithdrawFundOpen}>Transfer to Game</DepositButton>
        </Stack>
      </Stack>
      <Modal
        keepMounted
        open={withdrawmodal}
        onClose={handleWithdrawClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={modalstyle}>
          <Grid container>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <Typography variant='h5'>
                Withdraw to metamask
              </Typography>
              <Typography variant='p'>
                Widthraw Max Amount : {contractBalance}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={widthraw} onChange={(e) => setWidthraw(e.target.value)} />
            </Grid>
            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={withdrawYMIR}>
                Withdraw
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={depositmodal}
        onClose={handleDepositClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={modalstyle}>
          <Grid container>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <Typography variant='h5'>
                Deposit from Metamask
              </Typography>
              <Typography variant='p'>
                Wallet Amount : {walletBalance}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={deposit} onChange={(e) => setDeposit(e.target.value)} />
            </Grid>
            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={DepositYMIR}>
                Deposit
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={depositFundmodal}
        onClose={handleDepositFundClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={modalstyle}>
          <Grid container>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <Typography variant='h5'>
                Claim Ymir Coins
              </Typography>
              <Typography variant='p'>
                Ymir Coin : {fundBalance}
              </Typography>
            </Grid>
            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={DepositFund}>
                Claim
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={withdrawFundmodal}
        onClose={handleWithdrawFundClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={modalstyle}>
          <Grid container>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <Typography variant='h5'>
                Transfer to Game
              </Typography>
              <Typography variant='p'>
                Ymir Coin : {contractBalance}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={withdrawFund} onChange={(e) => setWithdrawFund(e.target.value)} />
            </Grid>
            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={WithdrawFund}>
                Withdraw
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={verifymodal}
        onClose={handleVerifyClose}
        aria-labelledby='keep-mounted-modal-title'
        aria-describedby='keep-mounted-modal-description'
      >
        <Box sx={formstyle}>
          <Typography id="keep-mounted-modal-title" variant="h5">
            Transaction Verify
          </Typography>
          <Grid container>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 }, mt: 2 }}>
              <Typography variant="p" color='#333'>
                E-mail Verification code
              </Typography>
              <VerifyTextfieldWrap direction="row" alignItems="center">
                <VerifyTextfield fullWidth size="small" type="text" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                <VerifyButton
                  disabled={flag}
                  onClick={() => {
                    dispatch(resend());
                    setFlag(true);
                  }}
                >
                  {flag ? <CountDown flag={flag} setFlag={setFlag} /> : 'Get code'}
                </VerifyButton>
              </VerifyTextfieldWrap>
              <Typography variant="p" color='#aaa'>
                Enter the 6-digit code sent to  {user.email.split('@')[0].slice(0, 4)}***@{user.email.split('@')[1]}
              </Typography>
            </Grid>
            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
              <AuthButton onClick={onVerify} sx={{ mt: 2 }} fullWidth>
                Verify
              </AuthButton>
            </Stack>
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
}

export default YMIRTransaction