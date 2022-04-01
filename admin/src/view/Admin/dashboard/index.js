import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { getLogs } from '../../../actions/logs';
import { getUserData } from '../../../actions/user';
import { getCharacters } from '../../../actions/character';
import Sidebar from '../adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody } from '../../../components/adminlayout/LayoutItem';

import YMIR from './YMIR';
import ROK from './ROK';
import LogItem from './LogItem';

const DashboardBody = styled(Grid)(({ theme }) => ({
  padding: '0 20px',
  paddingTop: '26px',
  color: '#F5F6F9',
  width: '65%',
  [theme.breakpoints.down('xl')]: {
    width: '80%',
  },
  [theme.breakpoints.down('lg')]: {
    padding: '0 5px',
    paddingTop: '26px',
    width: '100%',
  },
}));

function UserDashabord() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const logs = useSelector(state => state.logs);
  const characters = useSelector(state => state.character.characters);
  const userData = useSelector(state => state.user);
  const { card, costume, equipment } = userData;

  const { user } = auth;
  const { loglist } = logs;

  let displaylogs = loglist.length > 10 ? loglist.slice(0, 10) : loglist;
  const [ zeny, setZeny ] = useState(0);

  useEffect(() => {
    if (user) {
      dispatch(getLogs(user.account_id));
      dispatch(getCharacters(user.account_id));
      dispatch(getUserData(user?.account_id));
    }
  }, [ user, dispatch ]);

  useEffect(() => {
    let sum = 0;
    for (let i=0; i<characters.length; i++) {
      sum += characters[i].zeny;
    }
    setZeny(sum);
  }, [ characters ]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      <AdminLayout>
        <AdminBody direction='row'>
          <Sidebar />
          <AdminMainBody>
            <DashboardBody container>
              <Grid item md={6} xs={12} sx={{px: 1, mt: 5}}>
              </Grid>
              <Grid item md={6} xs={12} sx={{px: 1}}></Grid>

              <YMIR />

              <ROK />
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item1.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>{characters.length}</Typography>
                    <Typography component='p' variant='p' align='center'>CHARACTERS</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item2.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>{card}</Typography>
                    <Typography component='p' variant='p' align='center'>EQUIPMENTS</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item3.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>{costume}</Typography>
                    <Typography component='p' variant='p' align='center'>COSTUMES</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={3} sm={6} xs={12} sx={{px: 1, mb: 2}}
              >
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/item4.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>{equipment}</Typography>
                    <Typography component='p' variant='p' align='center'>CARDS</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12} sx={{px: 1, mb: 2}}>
                <Stack
                  sx={{
                    p: 2,
                    border: '1px solid #F5F6F9',
                    borderRadius: '8px',
                    height: '70px'
                  }}
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box
                    component='img'
                    src='/userpanel/coin.png'
                  />
                  <Box>
                    <Typography component='h5' variant='h5' align='center'>{numberWithCommas(zeny)}</Typography>
                    <Typography component='p' variant='p' align='center'>ZENY</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item md={6} xs={12} sx={{px: 1}}></Grid>
              <Grid item xs={12} sx={{px: 1}}>
                <Stack>
                  <Typography component='h5' variant='h5' sx={{mb: 1}}>Activities</Typography>
                </Stack>
                {
                  displaylogs ? displaylogs.map((item, i) => (
                    <LogItem logitem={item} key={i} />
                  )) : null
                }
              </Grid>
            </DashboardBody>
          </AdminMainBody>
        </AdminBody>
    	</AdminLayout>
    </>
  );
}

export default UserDashabord;