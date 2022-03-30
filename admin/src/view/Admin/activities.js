import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { useHistory, Redirect } from "react-router-dom";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

import { styled } from '@mui/material/styles';

import { setAlert } from '../../actions/alert';
import { getLogs } from '../../actions/logs';

import Sidebar from './adminSidebar';

import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import AdminHeader from '../../components/adminlayout/AdminHeader';

import LogItem from './dashboard/LogItem';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97],
})

const DashboardBody = styled(Box)(({ theme }) => ({
  padding: '26px',
  paddingBottom: '0',
  color: '#F5F6F9',
  height: 'calc(100% - 50px)',
}));

function Activities({auth, logs, setAlert, getLogs}) {
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
    getLogs(user.account_id);
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
                }}
              />
            </DashboardBody>
          </AdminMainBody>
        </AdminBody>
    	</AdminLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  logs: state.logs
});

export default connect(mapStateToProps, { setAlert, getLogs })(Activities);