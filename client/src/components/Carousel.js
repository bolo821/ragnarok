import React, { useRef } from 'react';
import Slider from "react-slick";

import Box from '@mui/material/Box';

import { styled } from '@mui/material/styles';

import CarouselControl from './CarouselControl';

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  '& .slick-slide': {
    opacity: 0.2,
    transition: 'all .5s',
    [theme.breakpoints.down(800)]: {
      opacity: 1,
    }
  },
  '& .slick-center': {
    transform: 'scale(1.3)',
    opacity: 1,
    [theme.breakpoints.down(800)]: {
      transform: 'scale(1)',
    }
  },
  '& .slick-track': {
    paddingTop: '40px',
    paddingBottom: '40px'
  }
}));

const CarouselItemWrap = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  borderRadius: 1,
  display: 'flex',
  justifyContent: 'center',
  height: 388,
  width: 560,
  boxShadow: '0px 4px 31px rgba(0, 0, 0, 0.11)',
  position: 'relative',
  backgroundSize: 'cover !important',
  backgroundPosition: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100vw !important'
  },
}));

function CarouselItem({ item }) {
  return (
    <CarouselItemWrap
      sx={{
        background: `url(${item.url})`
      }}
    >
    </CarouselItemWrap>
  );
}

function Carousel({images}) {
  const carouselRef = useRef();

  var settings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    fade: false,
    variableWidth: true,
    arrows: false,
    centerPadding: '0px',
    centerMode: true,
    autoplay: true,
  };

  const handlePrevious = () => {
    carouselRef.current.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current.slickNext();
  };

  return (
    <RootStyle>
      <Slider ref={carouselRef} {...settings}>
        {images.map((item, i) => (
          <a href={item.link} key={i} target="_blank" rel="noreferrer">
            <CarouselItem item={item} key={i}/>
          </a>
        ))}
      </Slider>
      <CarouselControl onNext={handleNext} onPrevious={handlePrevious} />
    </RootStyle>
  );
}

export default Carousel;