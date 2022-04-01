import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
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

const LogoBox = styled(Box)(({ theme }) => ({
  marginRight: '8px',
  padding: '4px 0',
  height: '150px',
  marginTop: '80px',
  [theme.breakpoints.down('lg')]: {
    height: '100px',
    marginTop: '40px',
  },
}));

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

const Header = ({logout, isAuthenticated}) => {
  const { deactivate } = useWeb3React();
  const history = useHistory();
  return (
    <>
      <HeaderWrapper position="fixed">
        <Box sx={{width: '100%', maxWidth: '1400px', margin: '0 auto'}}>
          <Toolbar sx={{ height: '110px', justifyContent: {xl: 'center', xs: 'space-between'} }}>
            <Box sx={{ display: { xs: 'none', xl: 'flex' } }} alignItems='center'>
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
              <LogoBox
                component="img"
                src="/logo.png"
              />
            </Box>

            <Box sx={{ display: { xs: 'none', xl: 'flex' } }} alignItems='center'>
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
                        await logout(history)
                        await deactivate();
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
              <Box
                sx={{
                  height: '140px',
                  width: '162px',
                }}
              >
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
            <Box sx={{display:  {xs:'flex', xl:'none'}}}>
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
      </HeaderWrapper>
    </>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);