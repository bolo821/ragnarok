import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const ServerFeatureWrap = styled(Box)(({ theme }) => ({
  backgroundColor: '#1c2023',
  backgroundSize: 'cover',
  padding: '40px 0',
  paddingTop: 10,
  backgroundImage: 'url(/serverfeature.png)'
}));

const Title = styled(Typography)(({ theme }) => ({
  color: 'white',
  lineHeight: 1
}));

export default function ServerFeature() {
  return (
    <ServerFeatureWrap id='server'>
      <Stack direction='column' justifyContent='space-around' alignItems='center'>
        <Title variant='h4' component='h4' align='center' fontWeight={600}>
          SERVER FEATURES
        </Title>
        <Grid container sx={{mt: 4}}>
          <Grid item xs={12} md={3} sm={6}>
            <Stack alignItems='center'>
              <Box
                component='img'
                src='/server/servercharacter1.png'
                sx={{height: '250px'}}
              />
              <Typography variant='h5' component='h5' color='white' fontWeight={600}>
                PLAY TO EARN
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3} sm={6}>
            <Stack alignItems='center'>
              <Box
                component='img'
                src='/server/servercharacter2.png'
                sx={{height: '250px'}}
              />
              <Typography variant='h5' component='h5' color='white' fontWeight={600}>
                GUILD HALL
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3} sm={6}>
            <Stack alignItems='center'>
              <Box
                component='img'
                src='/server/servercharacter3.png'
                sx={{height: '250px'}}
              />
              <Typography variant='h5' component='h5' color='white' fontWeight={600}>
                BLUEPRINT
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3} sm={6}>
            <Stack alignItems='center'>
              <Box
                component='img'
                src='/server/servercharacter4.png'
                sx={{height: '250px'}}
              />
              <Typography variant='h5' component='h5' color='white' fontWeight={600}>
                PROGRESSIVE EPISODE
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </ServerFeatureWrap>
  );
}
