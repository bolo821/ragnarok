/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha'
import { recaptcha as RECAPTCHA_KEY } from '../../config';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import {useWeb3React} from '@web3-react/core';
import { useHistory } from "react-router-dom";
import { forgotpassword, walletuser } from '../../actions/auth';
import { AuthWrapper, AdminBody, AuthButton, AdminTextField, formstyle } from '../../components/adminlayout/LayoutItem';
import CountDown from '../../components/CountDown';

const LoginBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

function ForgotPassword() {
  const dispatch = useDispatch();
  const {account, deactivate } = useWeb3React();
  const history = useHistory();

  const [formData, setFormData] = useState({
    email: '',
  });
  const [ recaptcha, setRecaptcha ] = useState(!parseInt(process.env.REACT_APP_CAPCHA));
  const [flag, setFlag] = useState(false);

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  useEffect(() => {
    if(account) {
      dispatch(walletuser(account, history));
    }
  }, [account])

  useEffect(() => { // check current wallet is exist in database
    deactivate();
    return () => {
      setFlag(false);
    }
  }, [])

  const handleSubmit = () => {
    if (recaptcha) {
      dispatch(forgotpassword({email}));
    }
  }

  return (
    <>
      <AuthWrapper>
      	<AdminBody>
          <LoginBody justifyContent='center'>
            <Box sx={formstyle}>
              <Typography id="keep-mounted-modal-title" variant="h5" component="h3">
                Forgot Password!
              </Typography>
              <Grid container sx={{mt: 1}}>
                <AdminTextField
                  fullWidth
                  label='Please Input your email address'
                  size='small'
                  name='email'
                  value={email}
                  onChange={onChange}
                />
                <ReCAPTCHA
                  sitekey={RECAPTCHA_KEY}
                  onChange={() => setRecaptcha(true)}
                />
                <Stack alignItems={{xs: 'center', width: '100%', mt: 4}}>
                  <AuthButton
                    fullWidth
                    disabled={flag}
                    onClick={() => {handleSubmit(); setFlag(true);}}
                  >
                    {flag ? <CountDown color='white' flag={flag} setFlag={setFlag} /> : 'Get code'}
                  </AuthButton>
                </Stack>
              </Grid>
            </Box>
          </LoginBody>
      	</AdminBody>
    	</AuthWrapper>
    </>
  );
}

export default ForgotPassword;