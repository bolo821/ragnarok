import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import NewsIon from '@mui/icons-material/NewReleases';

import { useWeb3React } from '@web3-react/core';


import { Link } from "react-router-dom";

const data = [
  { icon: <DashboardIcon />, label: 'Dashboard', url: '/dashboard' },
  { icon: <AssignmentIcon />, label: 'Activities', url: '/activities' },
  { icon: <SettingsIcon />, label: 'Account Management', url: '/manageaccount' },
  { icon: <NewsIon />, label: 'News', url: '/news' },
  { icon: <AssignmentIcon />, label: 'Users', url: '/users' },
  { icon: <AssignmentIcon />, label: 'Balances', url: '/balances' },
  // { icon: <AssignmentIcon />, label: 'Mail', url: '/mail' },
  // { icon: <AssignmentIcon />, label: 'Tokens', url: '/tokens' },
  { icon: <AssignmentIcon />, label: 'Mode', url: '/mode' },
  { icon: <AssignmentIcon />, label: 'Ymir Transactions', url: '/transactionsymir' },
  { icon: <AssignmentIcon />, label: 'Rok Transactions', url: '/transactionsrok' },
  { icon: <AssignmentIcon />, label: 'Logs', url: '/logs' },
  { icon: <AssignmentIcon />, label: 'Mail Server', url: '/mailserver' },
];

const FireNav = styled(List)({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});

const AdminListItemText = styled(ListItemText)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

const AdminListItemButton = styled(ListItemButton)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingRight: '15px !important',
    paddingLeft: '15px !important'
  },
}))

const AdminListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    marginRight: '0 !important'
  },
}))

function Sidebar() {
  const auth = useSelector(state => state.auth);
  const { account } = useWeb3React();
  const history = useHistory();
  const pathname = history.location.pathname;

  const { user } = auth;
  const accountEllipse = account ? account.substring(0, 4)+'...' + account.substring(account.length - 4) : '';

  return (
    <Box sx={{ display: 'flex', position: 'fixed' }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: 'dark',
            primary: { main: 'rgb(102, 157, 246)' },
            background: { paper: '#242735' },
          },
        })}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 256,
            height: 'calc(100vh - 100px)',
            borderRight: '1px solid #F5F6F9'
          }}
        >
          <FireNav component="nav" disablePadding>
            <Divider />
            <ListItem component="div" sx={{borderBottom: '1px solid #F5F6F9'}} >
              <Stack alignItems='center'>
                <Stack direction='row' alignItems='center' justifyContent='center' sx={{pt: 2}}>
                  <img src={`${process.env.PUBLIC_URL}/logo.png`} width="70%" alt="logo" />
                </Stack>
                <Stack direction='row' alignItems='center' sx={{mt: 2}}>
                  <AdminListItemText
                    primary={user ? user.email : ''}
                    primaryTypographyProps={{
                      color: '#F5F6F9',
                      fontWeight: 'medium',
                      variant: 'body2',
                    }}
                    sx={{
                      '& span': {
                        width: '150px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                </Stack>
                <AdminListItemText
                  primary={'Wallet: ' + accountEllipse}
                  primaryTypographyProps={{
                    color: '#F5F6F9',
                    fontWeight: 'medium',
                    variant: 'body2',
                  }}
                  sx={{

                    '& span': {
                      width: '150px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                  style={{textAlign: 'center'}}
                />
              </Stack>
            </ListItem>
            <Box
              sx={{
                pt: 2
              }}
            >
            {
              data.map((item, i) => (
                <Link to={item.url} key={i}>
                  <AdminListItemButton
                    key={item.label}
                    sx={{
                      py: 0,
                      minHeight: 32,
                      color: 'rgba(255,255,255,.8)',
                      background: pathname.indexOf(item.url) >= 0 ? 'rgba(71, 98, 130, 0.2)' : ''
                    }}
                  >
                    <AdminListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon}
                    </AdminListItemIcon>
                    <AdminListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
                    />
                  </AdminListItemButton>
                </Link>
              ))}
            </Box>
          </FireNav>
        </Paper>
      </ThemeProvider>
    </Box>
  );
}

export default Sidebar;