import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { closeModal } from '../../actions/modal';

import { formstyle } from '../adminlayout/LayoutItem';

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function SuccessModal({modal, closeModal}) {
  const { status, message } = modal

  return (
    <Modal
      keepMounted
      open={status}
      onClose={closeModal}
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
    >
      <Box sx={formstyle}>
        <Typography id="keep-mounted-modal-title" variant="h5">
          Success
        </Typography>
        <Grid container>
          <Grid item xs={12} sx={{py: {lg: 2, sm: 1, xs: 0}, mt: 2}}>
            <Typography variant="p" color='#333'>
              {message}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modal,
});

export default connect(mapStateToProps, { closeModal })(SuccessModal);