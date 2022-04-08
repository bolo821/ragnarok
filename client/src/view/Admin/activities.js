/* eslint-disable */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import Sidebar from './adminSidebar';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import LogItem from './dashboard/LogItem';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { getLogs } from '../../actions/logs';

const injected = new InjectedConnector({
  supportedChainIds: [ 56, 97 ],
})

const DashboardBody = styled(Box)(({ theme }) => ({
  padding: '26px',
  paddingBottom: '0',
  color: '#F5F6F9',
  height: 'calc(100% - 50px)',
}));

function Activities() {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const logs = useSelector(state => state.logs);
  const { user, isAuthenticated } = auth;
  const { loglist } = logs;

  const {account, activate} = useWeb3React();

  const [page, setPage] = React.useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => { // check current wallet is exist in database
    if(!account) {
      activate(injected);
    }
  }, [account])

  useEffect(() => {
    dispatch(getLogs(user.account_id));
  }, [getLogs])

  if (isAuthenticated) {
    if(user) {
      if(user.verify === 0) {
        return <Redirect to="/emailverification" />;
      }
    }
  }

  let displaylogs = loglist.slice((page - 1) * 10, page * 10);

  return (
    <>
      {/*<AdminHeader />*/}
      <AdminLayout>
        <AdminBody direction='row'>
          <Sidebar />
          <AdminMainBody>
            <DashboardBody justifyContent='center'>
              <Grid container>
                <Grid
                  item
                  xs={12}
                >
                  <Stack>
                    <Typography component='h5' variant='h5' sx={{mb: 3}}>Activities</Typography>
                  </Stack>
                  {
                    displaylogs ? displaylogs.map((item, i) => (
                      <LogItem logitem={item} key={i} />
                    )) : null
                  }
                </Grid>
              </Grid>
              <Pagination
                count={Math.ceil(loglist.length/10)}
                page={page}
                onChange={handleChange}
                color='primary'
                size='large'
                sx={{
                  marginTop: '20px',
                  '& button': {
                    color: 'white'
                  }
                }}
              />
            </DashboardBody>
          </AdminMainBody>
        </AdminBody>
    	</AdminLayout>
    </>
  );
}

export default Activities;