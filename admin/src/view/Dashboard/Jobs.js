import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import NftCard from '../../components/NftCard';
import { styled } from '@mui/material/styles';

const JobsWrapper = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(/background/howtobuy.jpg)',
  paddingTop: '40px'
}));

const JobTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: '#4e3630',
  textAlign: 'center',
  padding: '5px 30px',
  width: 'fit-content',
  margin: '0 auto',
  marginBottom: '40px',
  borderTop: '3px solid #985e03',
  borderBottom: '3px solid #985e03',
  backgroundColor: '#f4e4ba',
  [theme.breakpoints.down('md')]: {
    fontSize: '25px'
  }
}));

export default function Jobs() {
  return (
    <JobsWrapper>
      <Stack sx={{maxWidth: '1800px', width: '100%', margin: 'auto'}} direction={{xs: 'column', lg: 'row'}} alignItems='center' justifyContent='space-between'>
        <Box sx={{maxWidth: '800px'}}>
          <JobTitle variant='h4' component='h4'>
            FIRST JOBS
          </JobTitle>
          <Grid container>
            <NftCard src={`${process.env.PUBLIC_URL}/images/1st_Job/SWORDMAN.png`} title='SWORDMAN' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/1st_Job/ACOLYTE.png`} title='ACOLYTE' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/1st_Job/MAGICIAN.png`} title='MAGICIAN' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/1st_Job/MERCHANT.png`} title='MERCHANT' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/1st_Job/THIEF.png`} title='THIEF' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/1st_Job/ARCHWER.png`} title='ARCHER' />
          </Grid>
        </Box>
        <Box sx={{maxWidth: '800px'}}>
          <JobTitle variant='h4' component='h4'>
            SECOND JOBS
          </JobTitle>
          <Grid container>
            <NftCard src={`${process.env.PUBLIC_URL}/images/2st_Job/KNIGHT.png`} title='KNIGHT' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/2st_Job/PRIEST.png`} title='PRIEST' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/2st_Job/WIZARD.png`} title='WIZARD' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/2st_Job/BLACKSMITH.png`} title='BLACKSMITH' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/2st_Job/ASSASSIN.png`} title='ASSASSIN' />
          
            <NftCard src={`${process.env.PUBLIC_URL}/images/2st_Job/HUNTER.png`} title='HUNTER' />
          </Grid>
        </Box>
      </Stack>
    </JobsWrapper>
  );
}
