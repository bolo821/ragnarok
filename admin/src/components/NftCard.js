import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import { styled, alpha } from '@mui/material/styles';

const NftCardWrapper = styled(Box)(({ theme }) => ({
  height: '300px',
  maxWidth: '250px',
  width: '100%',
  margin: '0 auto',
  marginBottom: '40px',
  position: 'relative'
}));

const Title = styled(Typography)(({ theme }) => ({
  color: '#985e03',
  fontWeight: 800,
  padding: '0 5px',
  border: '4px solid #985e03',
  backgroundColor: 'white',
  borderRadius: '10px',
  width: '120px',
  textAlign: 'center',
  marginTop: '-20px',
  zIndex: 10
}));

const ImageWrap = styled(Stack)(({ theme }) => ({
  height: '100%',
  width: '100%',
  maxWidth: '250px',
  position: 'absolute',
  top: 0
}));

const ImageBackWrap = styled(Stack)(({ theme }) => ({
  height: 'calc(100% - 25px)',
  maxWidth: '250px',
  backgroundColor: '#edc86f',
  borderRadius: '10px',
  border: '4px solid #985e03'
}));

const Image = styled(Box)(({ theme }) => ({
  height: '100%',
  width: 'fit-content',
  marginTop: '-25px'
}));

export default function NftCard({src, title}) {
  return (
    <NftCardWrapper>
      <ImageBackWrap>
      </ImageBackWrap>
      <ImageWrap alignItems='center'>
        <Image
          component="img"
          src={src}
        />
      </ImageWrap>
      <Stack justifyContent='space-between' alignItems='center'>
        <Title>
          {title}
        </Title>
      </Stack>
    </NftCardWrapper>
  );
}
