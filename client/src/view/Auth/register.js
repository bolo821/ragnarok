import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha'
import { recaptcha as RECAPTCHA_KEY } from '../../config';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import Modal from '@mui/material/Modal';

import { styled } from '@mui/material/styles';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

import { AuthWrapper, AdminBody, AdminTextField, AuthButton, formstyle } from '../../components/adminlayout/LayoutItem';

import { recaptcha } from '../../config';

const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  height: "40px",
  color: "black",
  border: "1px solid #999",
  width: "100%"
}));

const injected = new InjectedConnector({
  supportedChainIds: [56, 97],
})

const RegisterBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

function Register() {
  const dispatch = useDispatch();
  const { account, activate, active } = useWeb3React();
  const history = useHistory();

  const [formData, setFormData] = useState({
    userid: '',
    email: '',
    password: '',
    password2: '',
    address: ''
  });

  const { userid, email, password, password2 } = formData;
  const [ recaptcha, setRecaptcha ] = useState(!parseInt(process.env.REACT_APP_CAPCHA));

  const onChange = (e) => {
    if(e.target.name === "userid"){
      if(e.target.value.match(/\W/)){
        setAlert('Do not write the special character', 'warning')
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const validate = () => {
    return formData.userid !== '' && formData.email !== '' && formData.password !== '' && formData.password2 !== '' && recaptcha;
  }

  useEffect(() => {
    setFormData({ ...formData, address: account });
  }, [ account ]);

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log("ex", ex)
    }
  }

  const accountEllipsis = account ? account : null;

  const onRegister = async (e) => {
    e.preventDefault();
    if (!validate()) {
      dispatch(setAlert('Please fill all fields.', 'warning'));
    } else if (formData.password !== formData.password2) {
      dispatch(setAlert('Passwords do not match', 'warning'));
    } else if (formData.address === '') {
      dispatch(setAlert('Please connect your wallet.', 'warning'));
    } else {
      dispatch(register({ userid, email, password, wallet: account }, history));
    }
  };

  return (
    <>
      {/*<AdminHeader />*/}
      <AuthWrapper>
        <AdminBody direction='row'>
          {/*<Sidebar />*/}
          <Box sx={{ width: '100%' }}>
            <RegisterBody justifyContent='center'>
              <Box sx={formstyle}>
                <Typography id="keep-mounted-modal-title" variant="h5" color='#000'>
                  Create Main Account
                </Typography>
                <Grid container sx={{ mb: 2 }}>
                  <Stack alignItems={{ xs: "center", width: "100%" }}>
                    {active ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "70px", width: "400px", fontSize: "14px", backgroundColor: "#f6eb15" }} className="accountEllipsis">
                        {accountEllipsis}
                      </span>
                    ) : (
                      <LoginButton onClick={connect}>
                        <img src='/wallets/metamask.svg' alt="metamask logo" /> Connect Metamask
                      </LoginButton>
                    )}
                  </Stack>
                </Grid>
                <form onSubmit={onRegister}>
                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Username" size='small' name="userid" value={formData.userid} onChange={onChange} disabled={!account} />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Email" size='small' type='email' name="email" value={formData.email} onChange={onChange} disabled={!account} />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Password" size='small' type='password' name="password" value={formData.password} onChange={onChange} disabled={!account} />
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12}>
                      <AdminTextField fullWidth label="Confirm Password" size='small' type='password' disabled={!account} name="password2" value={formData.password2} onChange={onChange} />
                    </Grid>
                    <ReCAPTCHA
                      sitekey={RECAPTCHA_KEY}
                      onChange={() => setRecaptcha(true)}
                    />
                    <Stack alignItems={{ xs: 'center', width: '100%' }}>
                      <AuthButton type='submit' fullWidth disabled={!account}>
                        Register
                      </AuthButton>
                    </Stack>
                  </Grid>
                </form>
              </Box>
            </RegisterBody>
          </Box>
        </AdminBody>
      </AuthWrapper>
    </>
  );
}

export default Register;