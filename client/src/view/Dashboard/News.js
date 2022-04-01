import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Carousel from '../../components/Carousel';
import { getNews } from '../../actions/news';

const ServerInfoWrap = styled(Box)(({ theme }) => ({
  backgroundColor: '#1b3075',
  backgroundSize: 'cover',
  padding: '40px 0',
  paddingTop: 0
}));

const Title = styled(Typography)(({ theme }) => ({
  textShadow: '0px 4px 2px #000000',
  marginTop: '-35px',
  color: 'white',
  backgroundColor: '#1b3075',
  padding: '5px 70px',
  position: 'relative',
  lineHeight: 1,
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
    padding: '5px 20px',
    marginTop: '-20px',
  },
}));

export default function News() {
  const news = useSelector(state => state.news.news);
  const dispatch = useDispatch();

  const [ images, setImages ] = useState([]);

  useEffect(() => {
    dispatch(getNews());
  }, [ dispatch ]);

  useEffect(() => {
    if (news.length) {
      setImages(news.map(ele => {
        return {
          url: ele.path,
          link: ele.link,
        }
      }))
    }
  }, [ news ]);

  return (
    <ServerInfoWrap id="server">
      <Stack direction='column' justifyContent='space-around' alignItems='center'>
        <Title variant="h4" component="h4" fontWeight={600} className='newstitle'>
          NEWS AND UPDATES
        </Title>
      </Stack>
      <Box sx={{mx: 'auto', mt: 4}}>
        <Carousel images={images} />
      </Box>
    </ServerInfoWrap>
  );
}
