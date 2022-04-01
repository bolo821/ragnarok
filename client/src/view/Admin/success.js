import React from 'react';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Redirect, Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { AuthLayout, AdminBody, formstyle } from '../../components/adminlayout/LayoutItem';

const VerifyBody = styled(Stack)(({ theme }) => ({
  height: '100%'
}));

function SuccessPage({auth}) {
  const { transaction_verify, isAuthenticated, user } = auth;

  if(transaction_verify) {
    return <Redirect to="/dashboard" />;
  }

  if (isAuthenticated) {
    if(user) {
      if(user.verify === 0) {
        return <Redirect to="/emailverification" />;
      }
    }
  }

  return (
    <>
      <AuthLayout>
        <AdminBody direction='row'>
        	<Box sx={{width: '100%'}}>
            <VerifyBody justifyContent='center'>
              <Box sx={formstyle}>
                <Typography id="keep-mounted-modal-title" variant="h6" color='#985e03' fontWeight={600} align='center' component="h3">
                  Your Transaction was successfully finished.
                </Typography>
                <Stack direction="row" justifyContent="center" sx={{width: "100%"}}>
                  <Link to="/dashboard" style={{color: "#1c4f9c", marginLeft: '10px'}}>Go to Dashboard</Link>
                </Stack>
              </Box>
            </VerifyBody>
        	</Box>
        </AdminBody>
    	</AuthLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(SuccessPage);