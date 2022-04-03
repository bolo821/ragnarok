/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Spinner from '../layout/Spinner';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { toast } from 'react-toastify';

const injected = new InjectedConnector({
  supportedChainIds: [ 56, 97 ],
})

export const AdminWrapper = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 100px)',
  backgroundColor: '#242735',
  marginTop: '100px'
}));

export const AuthWrapper = styled(Box)(({ theme }) => ({
  minHeight: 'calc(100vh - 100px)',
  backgroundImage: 'url(/background/howtobuy.jpg)',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  marginTop: '100px'
}));

export const AdminBody = styled(Stack)(({ theme }) => ({
	height: '100%'
}));

export const AdminMainBody = styled(Box)(({ theme }) => ({
	height: '100%',
	margin: '0 auto',
  marginLeft: '245px',
  width: 'calc(100% - 245px)',
  [theme.breakpoints.down('md')]: {
    width: 'calc(100% - 51px)',
    marginLeft: '51px',
  },
}));

export const AuthButton = styled(Button)(({ theme }) => ({
  height: '40px',
  color: 'white',
  fontWeight: 600,
  border: '1px solid #fff',
  backgroundColor: '#1c4f9c',
  borderRadius: '20px',
  margin: '4px 0',
  '&:hover': {
    color: '#242735',
    border: '1px solid #1c4f9c',
  }
}));

export const AdminTextField = styled(TextField)(({ theme }) => ({
  margin: '10px 0',
  borderRadius: '5px',
  // backgroundColor: '#242735',
  '& span': {
    color: 'black'
  },
  '& input': {
    color: 'black'
  },
  '& label': {
    color: '#777'
  },
  '& fieldset': {
    border: '1px solid #999',
    color: 'black'
  }
}));

export const VerifyTextfieldWrap = styled(Stack)(({ theme }) => ({
  border: '1px solid #999',
  borderRadius: '5px',
  marginBottom: '5px',
  marginTop: '5px',
}));

export const VerifyTextfield = styled(TextField)(({ theme }) => ({
  '& fieldset': {
    border: 0,
    color: 'black'
  },
  '& input': {
    color: 'black'
  },
}));

export const VerifyButton = styled(Button)(({ theme }) => ({
  color: '#985e03',
  fontWeight: 600,
  textTransform: 'none',
  width: '110px'
}));

export const formstyle = {
  marginTop: {
    sm: '150px',
    xs: '50px'
  },
  minWidth: 250,
  maxWidth: 450,
  width: '35%',
  py: 4,
  px: {
    sm: 4,
    xs: 2
  },
  borderRadius: '10px',
  border: '1px solid #242735',
  mx: 'auto',
  backgroundColor: 'white',
};

function AdminLayoutCom({ children }) {
  const authState = useSelector(state => state.auth);
  const { user, isAuthenticated } = authState;
  const { account, activate, active, chainId } = useWeb3React();
  const [ auth, setAuth ] = useState(false);

  useEffect(() => {
    if (!account) {
      activate(injected);
    }
  }, [ account ])

  const ref = useRef();

  useEffect(() => {
    if(active && isAuthenticated) {
      if (chainId !== 97) {
        toast.warn('Current network is not supported. Please connect another network.');
        ref.current = false;
      } else {
        if(user && user.wallet !== account){
          ref.current = false;
          toast.warn('Current wallet is not your wallet. Please connect your wallet.');
        } else {
          ref.current = true;
        }
      }
    } else {
      ref.current = false;
    }
    setAuth(ref.current)
  }, [ active, isAuthenticated, account, chainId ]);

  return (
    <AdminWrapper>
      {auth ? children : <Spinner />}
    </AdminWrapper>
  )
}

function AuthLayoutCom({ children }) {
  const authState = useSelector(state => state.auth);
  const { user, isAuthenticated } = authState;
  const {account, activate, active} = useWeb3React();
  const [auth, setAuth] = useState(false);

  useEffect(() => { // check current wallet is exist in database
    if(!account) {
      toast.warn('Please connect to your wallet');
      activate(injected);
    }
  }, [ account ])

  const ref = useRef();

  useEffect(() => {
    if(active && isAuthenticated) {
      if(user.wallet !== account){
        ref.current = false;
        window.alert('Current wallet is not your wallet. Please connect your wallet.', 'warning');
      } else {
        ref.current = true;
      }
    } else {
      ref.current = false;
    }
    setAuth(ref.current)
  }, [ active, isAuthenticated ]);

  return (
    <AuthWrapper>
      {auth ? children : <Spinner />}
    </AuthWrapper>
  )
}

export const AdminLayout = AdminLayoutCom;
export const AuthLayout = AuthLayoutCom;
