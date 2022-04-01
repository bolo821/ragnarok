import  React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import { connect } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import {useWeb3React} from '@web3-react/core';
import { Menu as DropMenu, MenuItem as DropMenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import { logout } from '../../actions/auth';

const HeaderWrapper = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#282d32',
  boxShadow: '0px 0px 10px 5px #111',
}));

const AuthButton = styled(Button)(({ theme }) => ({
  marginRight: '20px',
  width: '100px',
  height: '40px'
}));

const style1 = {
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

const style2 = {
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

const headstyle = {
  textDecoration: 'none',
  display: 'block',
  float: 'left',
  padding: '4px 8px',
  borderRadius: '10px',
  width: '130px',
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'white',
    color: '#000',
  }
}

const AdminHeader = ({logout, isAuthenticated}) => {
  const {deactivate} = useWeb3React();

  const [login, setLogin] = React.useState(false);
  const [register, setRegister] = React.useState(false);

  const handleLoginClose = () => setLogin(false);

  const handleRegisterClose = () => setRegister(false);
  const history = useHistory();
  
  return (
    <>
      <HeaderWrapper position="fixed">
        <Box sx={{width: '100%', maxWidth: '1400px', margin: '0 auto'}}>
          <Toolbar sx={{ height: '110px', justifyContent: {lg: 'center', xs: 'space-between'} }}>
            <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
              <Box sx={{width: 'fit-content'}}>
                <Link
                  to='/'
                >
                  <Typography sx={headstyle} textAlign="center">HOME</Typography>
                </Link>
              </Box>
              <Box sx={{width: 'fit-content'}}>
                <Link
                  to='#howtobuy'
                >
                  <Typography sx={headstyle} textAlign="center">WHITEPAPER</Typography>
                </Link>
              </Box>
              <Box sx={{width: 'fit-content'}}>
                <Link
                  to='#server'
                >
                  <Typography sx={headstyle} textAlign="center">MARKET PLACE</Typography>
                </Link>
              </Box>
              <Box sx={{width: 'fit-content'}}>
                <Link
                  to='#server'
                >
                  <Typography sx={headstyle} textAlign="center">YMIR PAY</Typography>
                </Link>
              </Box>
            </Box>

            <Box>
              <Box
                component="img"
                src="/logo.png"
                sx={{ mr: 2, py: 1, height: '150px', mt: 10 }}
              />
            </Box>

            <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
              <Box sx={{width: 'fit-content'}}>
                <Link
                  to='#nft'
                >
                  <Typography sx={headstyle} textAlign="center">NEWS</Typography>
                </Link>
              </Box>
              {
                isAuthenticated ? (
                  <Box sx={{width: 'fit-content'}}>
                    <Link
                      to='/dashboard'
                    >
                      <Typography
                        textAlign="center"
                        sx={headstyle}
                      >
                        UserPanel
                      </Typography>
                    </Link>
                  </Box>
                ) : (
                  <Box sx={{width: 'fit-content'}}>
                    <Link
                      to='/'
                    >
                      <Typography
                        textAlign="center"
                        sx={headstyle}
                      >
                        Downloads
                      </Typography>
                    </Link>
                  </Box>
                )
              }
              {
                isAuthenticated ? (
                  <Box sx={{width: 'fit-content'}}>
                    <Typography
                      textAlign="center"
                      sx={headstyle}
                      onClick={async () => {
                        console.log("history");
                        await deactivate();
                        await logout(history);
                      }}
                    >
                      Logout
                    </Typography>
                  </Box>
                ):(
                  <Box sx={{width: 'fit-content'}}>
                    <Link
                      to='/login'
                    >
                      <Typography
                        textAlign="center"
                        sx={headstyle}
                      >
                        Login
                      </Typography>
                    </Link>
                  </Box>
                )
              }
              <Box sx={{width: 'fit-content'}}>
                <Link
                  to='/'
                >
                  <Box
                    sx={{
                      height: '140px',
                      width: '162px',
                      backgroundSize: 'cover',
                      top: 0,
                      position: 'absolute',
                      backgroundImage: 'url(/playnow.png)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textShadow: '0px 4px 2px #000000'
                    }}
                  >
                    <Typography
                      textAlign="center"
                      variant="h5"
                      component="h5"
                      color="white"
                      // onClick={handleRegisterOpen}
                      sx={{marginTop: '-15px'}}
                    >
                      Play Now
                    </Typography>
                  </Box>
                </Link>
              </Box>
            </Box>
            <Box sx={{display:{xs:'flex',lg:'none'}}}>
              <DropMenu
                menuButton={
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    sx={{'& svg': {fontSize: '40px'}}}
                  >
                    <MenuIcon />
                  </IconButton>
                }
              >
                <DropMenuItem>
                  <Link to='/' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">HOME</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#howtobuy' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">WHITEPAPER</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#server' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">MARKETPLACE</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#nft' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">YMIR PAY</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#nft' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">NEWS</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#nft' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">DOWNLOADS</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#nft' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">YMIR PAY</Typography>
                  </Link>
                </DropMenuItem>
                <DropMenuItem>
                  <Link to='#nft' style={{ height: '20px', marginBottom: 16, textDecoration: 'none' }}>
                    <Typography textAlign="center" color="#000">PLAY NOW</Typography>
                  </Link>
                </DropMenuItem>
                {/*<DropMenuItem>
                  <Typography
                    textAlign="center" color="#000" sx={{ height: '20px', mb: 2, textDecoration: 'none' }}
                    onClick={handleLoginOpen}
                  >
                    Login
                  </Typography>
                </DropMenuItem>
                <DropMenuItem>
                  <Typography
                    textAlign="center" color="#000" sx={{ height: '20px', mb: 2, textDecoration: 'none' }}
                    onClick={handleRegisterOpen}
                  >
                    Register
                  </Typography>
                </DropMenuItem>*/}
              </DropMenu>
            </Box>
          </Toolbar>
        </Box>
        <Modal
          keepMounted
          open={login}
          onClose={handleLoginClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
          sx={{backgroundImage: 'url(/register/back1.png)'}}
        >
          <Box sx={style1}>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h3">
              Login
            </Typography>
            <Grid container>
              <Grid item xs={3} sx={{py: 2}} display='flex' alignItems='center' justifyContent='end'>
                <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' variant="h6" component="h3">
                  ID
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{py: 2}}>
                <TextField fullWidth label="ID" id="fullWidth" />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3} sx={{py: 2}} display='flex' alignItems='center' justifyContent='end'>
                <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' variant="h6" component="h3">
                  Password
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{py: 2}}>
                <TextField fullWidth label="Password" id="fullWidth" />
              </Grid>
              <Stack alignItems={{xs: 'center', width: '100%'}}>
                <AuthButton variant="outlined" onClick={handleLoginClose}>
                  Login
                </AuthButton>
              </Stack>
            </Grid>
          </Box>
        </Modal>
        <Modal
          keepMounted
          open={register}
          onClose={handleRegisterClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
          sx={{backgroundImage: 'url(/register/back1.png)', backgroundSize: '100% auto', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
        >
          <Box sx={style2}>
            <Typography id="keep-mounted-modal-title" variant="h6" component="h3">
              Register
            </Typography>
            <Grid container>
              <Grid item xs={3} sx={{py: 2}} display='flex' alignItems='center' justifyContent='end'>
                <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' variant="h6" component="h3">
                  ID
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{py: 2}}>
                <TextField fullWidth label="ID" id="fullWidth" />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3} sx={{py: 2}} display='flex' alignItems='center' justifyContent='end'>
                <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' variant="h6" component="h3">
                  Username
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{py: 2}}>
                <TextField fullWidth label="Username" id="fullWidth" />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3} sx={{py: 2}} display='flex' alignItems='center' justifyContent='end'>
                <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' variant="h6" component="h3">
                  Password
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{py: 2}}>
                <TextField fullWidth label="Password" id="fullWidth" />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3} sx={{py: 2}} display='flex' alignItems='center' justifyContent='end'>
                <Typography id="keep-mounted-modal-title" sx={{mr: '10px'}} align='right' variant="h6" component="h3">
                  Confirm
                </Typography>
              </Grid>
              <Grid item xs={9} sx={{py: 2}}>
                <TextField fullWidth label="Confirm Password" id="fullWidth" />
              </Grid>
              <Stack alignItems={{xs: 'center', width: '100%'}}>
                <AuthButton variant="outlined" onClick={handleRegisterClose}>
                  Register
                </AuthButton>
              </Stack>
            </Grid>
          </Box>
        </Modal>
      </HeaderWrapper>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(AdminHeader);