import PropTypes from 'prop-types';

import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

// material
import { useTheme, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

const SIZE = 60;

const RootStyle = styled(Box)(({ theme }) => ({
  top: 0,
  bottom: 0,
  zIndex: 9,
  height: SIZE,
  width: '1000px',
  left: 'calc(50% - 470px)',
  margin: '0 auto',
  transform: 'translate(-30px, 20px)',
  margin: 'auto',
  display: 'flex',
  position: 'absolute',
  justifyContent: 'space-between',
  [theme.breakpoints.down(1100)]: {
    display: 'none'
  }
}));

const ArrowStyle = styled(IconButton)(({ theme }) => ({
  width: SIZE,
  height: SIZE,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  background: 'transparent',
  borderRadius: '50%',
  fontSize: '100px'
}));

// ----------------------------------------------------------------------

export default function CarouselControl({ arrowLine, onNext, onPrevious, ...other }) {
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  return (
    <RootStyle {...other}>
      <ArrowStyle size="small" onClick={onPrevious}>
        <FaAngleDoubleLeft />
      </ArrowStyle>

      <ArrowStyle size="small" onClick={onNext}>
        <FaAngleDoubleRight />
      </ArrowStyle>
    </RootStyle>
  );
}
