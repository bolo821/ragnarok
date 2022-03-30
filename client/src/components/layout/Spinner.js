import React, { Fragment } from 'react';
import Stack from '@mui/material/Stack';
import spinner from './spinner.gif';

const Spinner = () => (
  <Fragment>
  	<Stack sx={{height: 'calc(100vh - 100px)'}}>
	    <img
	      src={spinner}
	      style={{ width: '200px', margin: 'auto', display: 'block' }}
	      alt="Loading..."
	    />
  	</Stack>
  </Fragment>
);

export default Spinner;
