/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { styled } from '@mui/material/styles';
import { updateTempBalance, updateContractBalance, getWalletBalance, getContractBalance, updateFunndBalance, getAccountBalance } from '../../../actions/rokBalance';
import { setTverify, transactionverifyROK, resend } from '../../../actions/auth';
import { openModal } from '../../../actions/modal';

import { rokaddress, minterAddress } from '../../../config';
import { useContract } from '../../../hooks/useContract';
import { getMinterContract } from '../../../utils/contracts';
import ROKABI from '../../../services/abis/ROK.json';

import { useWeb3React } from '@web3-react/core';
import { AuthButton, AdminTextField, VerifyTextfieldWrap, VerifyTextfield, VerifyButton, formstyle } from '../../../components/adminlayout/LayoutItem';
import CountDown from '../../../components/CountDown';
import { getDecimalAmount } from '../../../utils/formatBalance';
import { toast } from 'react-toastify';
import { verifyNumberByDecimal, checkTokenExpiration } from '../../../utils/helper';
import ReCAPTCHA from 'react-google-recaptcha'
import { recaptcha as RECAPTCHA_KEY } from '../../../config';

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

function ROKTransaction() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { user, transaction_verify_rok } = auth;
  const balance = useSelector(state => state.rok);
  const { contractBalance, walletBalance, fundBalance } = balance;
  const rokContract = useContract(rokaddress, ROKABI);
  const history = useHistory();
  const { account } = useWeb3React();

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
  const [ recaptcha, setRecaptcha ] = useState(!parseInt(process.env.REACT_APP_CAPCHA));

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(getWalletBalance(rokContract, account));
      dispatch(getContractBalance(rokContract, account));
      dispatch(getAccountBalance(user.account_id));
    }, 2000);
    return () => clearInterval(timer);
  }, [])

  const onVerify = async (e) => {
    e.preventDefault();
    if (recaptcha)
      dispatch(transactionverifyROK(code, handleVerifyClose));
  };

  const handleDepositOpen = () => {
    setDepositmodal(true);
  }

  const handleDepositClose = () => setDepositmodal(false);

  const handleWithdrawOpen = () => {
    if (!transaction_verify_rok) {
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
    if (transaction_verify_rok) {
      handleWithdrawOpen();
    }
  }, [ transaction_verify_rok ]);

  const DepositROK = async () => {
    if (window.confirm("You are trying to deposit " + deposit + " RoK Points. Click confirm to proceed.")) {
      try {
        if (parseFloat(deposit) <= 0) {
          toast.warn('Please Input token Balance again.');
          setDeposit(0);
          return;
        }

        if (parseFloat(deposit) > parseFloat(walletBalance)) {
          toast.warn('Please Input correct token Balance.');
          setDeposit(0);
          return;
        }

        if (!verifyNumberByDecimal(deposit, 18)) {
          toast.warn('The number is exceeding the decimal.');
          setDeposit(0);
          return;
        }

        if (!checkTokenExpiration()) {
          toast.warn('Your token will be expired in 1 minute and we stopped your transaction to prevent your token loss. You can try after login again.');
          return;
        }

        toast.warn('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.');
        handleDepositClose()
        dispatch({ type: 'SET_LOADER', payload: true })
        let txHash = await rokContract.deposit(getDecimalAmount(deposit));
        let confirmation = await txHash.wait();
        let data = {
          token: 'ROK',
          hash: txHash.hash,
          account_id: user.account_id
        }

        if (confirmation.status === 1) {
          data.amount = Number(deposit);
          data.message = `You attempted to deposit ${deposit} RoK Points from your Metamask Wallet.`;
        } else {

          data.amount = deposit;
          data.message = `Your deposit attempt from Metamask wallet has failed.`;
        }

        dispatch(updateTempBalance(data, user.account_id));
        dispatch(setTverify(false));
        setDeposit(0);
        dispatch({ type: 'SET_LOADER', payload: false })
        dispatch(openModal(true, `Deposit from Metamask. ${deposit} RoK Points was successfully deposited into your game account wallet.`));

      } catch (err) {
        handleDepositClose()
        dispatch({ type: 'SET_LOADER', payload: false });
        setDeposit(0);
        toast.error('Something went wrong.');
      }
    }
  }

  const withdrawROK = async () => {
    if (window.confirm("You are trying to deposit " + widthraw + " RoK Points. Click confirm to proceed.")) {
      try {
        if (parseFloat(widthraw) <= 0 || parseFloat(contractBalance) < parseFloat(widthraw)) {
          toast.warn('Please Input token Balance again.');
          setWidthraw(0);
          return;
        }
        if (!verifyNumberByDecimal(widthraw, 18)) {
          toast.warn('The number is exceeding the decimal.');
          setWidthraw(0);
          return;
        }

        if (!checkTokenExpiration()) {
          toast.warn('Your token will be expired in 1 minute and we stopped your transaction to prevent your token loss. You can try after login again.');
          return;
        }

        toast.warn('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.');
        handleWithdrawClose();
        dispatch({ type: 'SET_LOADER', payload: true })
        let txHash = await rokContract.withdraw(getDecimalAmount(widthraw));
        let confirmation = await txHash.wait();
        let data = {
          token: 'ROK',
          account_id: user.account_id,
          hash: txHash.hash
        }

        if (confirmation.status === 1) {
          data.amount = Number(widthraw);
          data.message = `You attempted to withdraw ${widthraw} Rok Points into your Metamask Wallet.`;
        } else {
          data.amount = widthraw;
          data.message = `Your withdraw attempt to Metamask Wallet has failed.`;
        }
        dispatch(updateTempBalance(data, user.account_id));
        dispatch(setTverify(false));
        setWidthraw(0);
        dispatch({ type: 'SET_LOADER', payload: false })
        dispatch(openModal(true, `Withdraw to Metamask. ${widthraw} RoK Points was successfully withdrawn from your game account wallet.`));
      } catch (err) {
        setWidthraw(0);
        dispatch({ type: 'SET_LOADER', payload: false })
        handleWithdrawClose();
        toast.warn('Something went wrong.');
      }
    }
  }

	const DepositFund = async () => {
    if (window.confirm("You are trying to Claim " + fundBalance + " Rok Points. Click confirm to proceed.")) {
      try {
        let fundDepositBalance = await dispatch(getAccountBalance(user.account_id));
        if (parseFloat(fundDepositBalance) <= 0) {
          toast.warn('Please Token Balance again.');
          return;
        }
        if (!verifyNumberByDecimal(fundDepositBalance, 18)) {
          toast.warn('The number is exceeding the decimal.');
          return;
        }
        if (!checkTokenExpiration()) {
          toast.warn('Your token will be expired in 1 minute and we stopped your transaction to prevent your token loss. You can try after login again.');
          return;
        }

        toast.warn('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.');
        handleDepositFundClose()
        dispatch({ type: 'SET_LOADER', payload: true })
        let data = {
          token: 'ROK',
          type: 'deposit',
          amount: fundDepositBalance,
          account_id: user.account_id
        }
        let flag = await dispatch(updateContractBalance(data, user.account_id));
        if (flag === true) {
          const rokMinterContract = await getMinterContract(rokaddress, ROKABI);
          let txHash = await rokMinterContract.methods.WithdrawFromGame(account, getDecimalAmount(fundDepositBalance)).send({ from: minterAddress });
    		  data.hash = txHash.transactionHash;
          data.message = `You attempted to claim ${fundDepositBalance} RoK Points from your Game Account Wallet.`;
          dispatch(updateTempBalance(data, user.account_id));
          dispatch(getAccountBalance(user.account_id));
          dispatch({ type: 'SET_LOADER', payload: false });
          dispatch(openModal(true, `Claim Rok Points. ${fundDepositBalance} RoK Points was successfully claimed from your Game Account wallet.`));
        } else {
          dispatch({ type: 'SET_LOADER', payload: false })
          toast.error('Something went wrong.');
        }
      } catch (err) {
        handleDepositFundClose()
        dispatch({ type: 'SET_LOADER', payload: false })
        toast.error('Something went wrong.');
      }
    }
  }

  const WithdrawFund = async () => {
    if (window.confirm("You are trying to Transfer " + withdrawFund + " Rok Points into your Game Account Wallet. Click confirm to proceed.")) {
      try {
        if (parseFloat(withdrawFund) <= 0 || parseFloat(contractBalance) < parseFloat(withdrawFund)) {
          toast.warn('Please Input token Balance again.');
          setWithdrawFund(0);
          return;
        }
        if (!verifyNumberByDecimal(withdrawFund, 18)) {
          toast.warn('The number is exceeding the decimal.');
          setWithdrawFund(0);
          return;
        }
        if (!checkTokenExpiration()) {
          toast.warn('Your token will be expired in 1 minute and we stopped your transaction to prevent your token loss. You can try after login again.');
          return;
        }

        toast.warn('Please do not close the browser and wait for the transaction to be completed to avoid possible token loss.');
        dispatch({ type: 'SET_LOADER', payload: true })
        handleWithdrawFundClose();
        
        let txHash = await rokContract.DepositToGame(account, getDecimalAmount(withdrawFund));
        let confirmation = await txHash.wait();
        if (confirmation.status === 1) {
          let data = {
            token: 'ROK',
            type: 'withdraw',
            amount: withdrawFund,
      			hash : txHash.hash,
            account_id: user.account_id
          }
          let flag = await dispatch(updateFunndBalance(data, user.account_id));
          if (flag === true) {
      			data.message = `You attempted to transfer ${withdrawFund} RoK Points into your Game Account Wallet.`;
            dispatch(updateTempBalance(data, user.account_id));
            setWithdrawFund(0);
            dispatch({ type: 'SET_LOADER', payload: false })
            dispatch(openModal(true, `Transfer to Game. ${withdrawFund} RoK Points was successfully transfered into your Game Account Wallet.`));
          } else {
            dispatch({ type: 'SET_LOADER', payload: false });
            setWithdrawFund(0);
            toast.error('Something went wrong.');
          }
        } else {
          dispatch({ type: 'SET_LOADER', payload: false });
          setWithdrawFund(0);
          toast.error('Something went wrong.');
        }

      } catch (err) {
        dispatch({ type: 'SET_LOADER', payload: false })
        handleWithdrawFundClose();
        toast.error('Something went wrong.');
        setWithdrawFund(0);
      }
    }
  }

  useEffect(() => {
    let ROK_action = localStorage.getItem('ROK_action')
    if (transaction_verify_rok) {
      if (ROK_action === 'deposit')
        setDepositmodal(true);

      if (ROK_action === 'withdraw')
        setWithdrawmodal(true);
    }
  }, []);

  return (
    <Grid item md={6} xs={12} sx={{ px: 1, mb: 2 }}>
      <Stack
        sx={{
          p: 2,
          border: '1px solid #F5F6F9',
          borderRadius: '8px',
          backgroundImage: 'url(/userpanel/ymir.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right',
          backgroundSize: 'contain',
          height: '200px',
        }}
        justifyContent='space-between'
      >
        <Box>
          <Typography component='h5' variant='h5'>Metamask : {walletBalance ? walletBalance : 0} RoK Points </Typography>
          <Typography component='h5' variant='h5'>Web Wallet : {contractBalance ? contractBalance : 0} RoK Points</Typography>
          <Typography component='h5' variant='h5'>Claimable : {fundBalance ? fundBalance : 0} RoK Points</Typography>
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
          <DepositButton onClick={handleDepositFundOpen}>Claim RoK Points</DepositButton>
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
              <AuthButton variant='outlined' fullWidth onClick={withdrawROK}>
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
              <AuthButton variant='outlined' fullWidth onClick={DepositROK}>
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
                Claim RoK Points
              </Typography>
              <Typography variant='p'>
                RoK Points : {fundBalance}
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
                RoK Points : {contractBalance}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ py: { lg: 2, sm: 1, xs: 0 } }}>
              <AdminTextField fullWidth label='Balance' size='small' required type='number' value={withdrawFund} onChange={(e) => setWithdrawFund(e.target.value)} />
            </Grid>
            <Stack alignItems={{ xs: 'center', width: '100%' }} direction='row' justifyContent='space-around'>
              <AuthButton variant='outlined' fullWidth onClick={WithdrawFund}>
                 Transfer to Game
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
                    dispatch(resend(history));
                    setFlag(true);
                    localStorage.setItem('start', Number(new Date()))
                  }}
                >
                  {flag ? <CountDown flag={flag} setFlag={setFlag} /> : 'Get code'}
                </VerifyButton>
              </VerifyTextfieldWrap>
              <Typography variant="p" color='#aaa'>
                Enter the 6-digit code sent to  {user?.email.split('@')[0].slice(0, 4)}***@{user?.email.split('@')[1]}
              </Typography>
            </Grid>
            <ReCAPTCHA
              sitekey={RECAPTCHA_KEY}
              onChange={() => setRecaptcha(true)}
            />
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

export default ROKTransaction;