import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"
import { recaptcha as RECAPTCHA_KEY } from '../../config';
import { SOCKET } from "../../utils/api";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";

import { login } from "../../actions/auth";

import { AuthWrapper, AdminBody, AuthButton, AdminTextField, formstyle } from "../../components/adminlayout/LayoutItem";

const LoginBody = styled(Stack)(({ theme }) => ({
  height: "100%"
}));

function Login() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  console.log('process: ', process.env.REACT_APP_CAPCHA)
  const [ recaptcha, setRecaptcha ] = useState(!parseInt(process.env.REACT_APP_CAPCHA));
  const { email, password } = formData;

  const onLogin = async (e) => {
    e.preventDefault();
    if (recaptcha) {
      dispatch(login(email, password, history));
    }
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  useEffect(() => {
    SOCKET.emit('DISCONNECT');
  }, []);

  return (
    <>
      <AuthWrapper>
        <AdminBody>
          <LoginBody justifyContent="center">
            <Box sx={formstyle}>
              <Typography id="keep-mounted-modal-title" variant="h5">
                Log in
              </Typography>
              <Typography variant="h6" align="center" fontSize={16} color="#777">
                Login with email and password
              </Typography>
              <form onSubmit={onLogin} style={{ margin: '20px 0' }}>
                <Grid container sx={{ mt: 2 }}>
                  <AdminTextField
                    fullWidth
                    label="Email"
                    size="small"
                    name="email"
                    value={email}
                    onChange={onChange}
                  />
                  <AdminTextField
                    fullWidth
                    label="Password"
                    size="small"
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                  />
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_KEY}
                    onChange={() => setRecaptcha(true)}
                  />

                  <Stack alignItems="center" direction="row" justifyContent="space-around" sx={{ width: "100%", mt: 2 }}>
                    <AuthButton variant="outlined" type="submit" fullWidth>
                      Login
                    </AuthButton>
                  </Stack>
                </Grid>
              </form>
              <Divider />
              <Stack direction="row" justifyContent="center" sx={{ width: "100%", my: 3 }}>
                <Typography variant="h6" align="center" fontSize={16} color="#777">
                  Not registered yet?
                </Typography>
                <Link to="/register" style={{ color: "#1c4f9c", marginLeft: '10px' }}>Register Now</Link>
              </Stack>
              <Stack direction="row" justifyContent="center" sx={{ width: "100%", my: 3 }}>
                <Typography variant="h6" align="center" fontSize={16} color="#777">
                  Forgot your password?
                </Typography>
                <Link to="/forgotpassword" style={{ color: "#1c4f9c", marginLeft: '10px' }}>Reset Password?</Link>
              </Stack>
            </Box>
          </LoginBody>
        </AdminBody>
      </AuthWrapper>
    </>
  );
}

export default Login;