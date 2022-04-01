import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

function BalanceItem({balanceitem}) {

  return (
    <Stack
      direction='row'
      sx={{mb: 1}}
    >
      <Box>
        <Typography component='p' variant='p' fontWeight={600}>{balanceitem.email}</Typography>
        
      </Box>
      <Box>
        <Typography component='p' variant='p' fontWeight={600}>{balanceitem.userid}</Typography>
        
      </Box>
      <Box>
        <Typography component='p' variant='p' fontWeight={600}>{balanceitem.balance}</Typography>
        
      </Box>
    </Stack>
  );
}

export default BalanceItem;