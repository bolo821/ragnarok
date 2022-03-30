import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const BannerWrap = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundSize: '100%'
}));

const Banner = ({logout}) => {
  return (
    <Box sx={{mt: '110px', backgroundColor: '#1c4f9c'}}>
      <BannerWrap
        component='img'
        src="/banner.png"
      >
        
      </BannerWrap>
    </Box>
  );
};

export default Banner;