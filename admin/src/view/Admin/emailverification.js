import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SET_LOADER } from '../../actions/types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


import { styled } from '@mui/material/styles';
import { useHistory } from "react-router-dom";

import { emailverify, resend } from '../../actions/auth';

import { AdminBody, AuthButton, formstyle } from '../../components/adminlayout/LayoutItem';
import CountDown from '../../components/CountDown';


const VerifyBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

const VerifyTextfieldWrap = styled(Stack)(({ theme }) => ({
  border: '1px solid #999',
  borderRadius: '5px',
  marginBottom: '5px',
  marginTop: '5px',
}));

const VerifyTextfield = styled(TextField)(({ theme }) => ({
  '& fieldset': {
    border: 0,
    color: 'black'
  },
  '& input': {
    color: 'black'
  },
}));

const VerifyButton = styled(Button)(({ theme }) => ({
  color: '#985e03',
  fontWeight: 600,
  textTransform: 'none',
  width: '110px'
}));

function Emailverification() {
  const auth = useSelector(state => state.auth);
  const { user } = auth;
  const dispatch = useDispatch();

  const history = useHistory();

  const [code, setCode] = useState('');
  const [flag, setFlag] = useState(false);

  const onVerify = async (e) => {
    e.preventDefault();
    dispatch(emailverify(code, history));
  };

  useEffect(() => {
    dispatch({
      type: SET_LOADER,
      payload: false,
    });
  }, []);

  return (
    <>
      <AdminBody direction='row'>
        <Box sx={{width: '100%'}}>
          <VerifyBody justifyContent='center'>
            <Box sx={formstyle}>
              <Typography id="keep-mounted-modal-title" variant="h5">
                Email Verify
              </Typography>
              <Grid container>
                <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}, mt: 2}}>
                  <Typography variant="p" color='#333'>
                    E-mail Verification code
                  </Typography>
                  <VerifyTextfieldWrap direction="row" alignItems="center">
                    <VerifyTextfield fullWidth size="small" type="text" name="code" value={code} onChange={(e) => setCode(e.target.value)} />
                    <VerifyButton disabled={flag} onClick={()=>{dispatch(resend(history)); setFlag(true);}}>
                      {flag ? <CountDown flag={flag} setFlag={setFlag} /> : 'Get code'}
                    </VerifyButton>
                  </VerifyTextfieldWrap>
                  <Typography variant="p" color='#aaa'>
                    Enter the 6-digit code sent to  {user?.email.split('@')[0].slice(0, 4)}***@{user?.email.split('@')[1] }
                  </Typography>
                </Grid>
                <Stack alignItems={{xs: 'center', width: '100%'}} direction='row' justifyContent='space-around'>
                  <AuthButton onClick={onVerify} sx={{mt: 2}} fullWidth>
                    Verify
                  </AuthButton>
                </Stack>
              </Grid>
            </Box>
          </VerifyBody>
        </Box>
      </AdminBody>
    </>
  );
}

export default Emailverification;