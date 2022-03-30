import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { FaFacebookSquare, FaDiscord, FaTwitter, FaTelegramPlane } from "react-icons/fa";

import { styled, alpha } from '@mui/material/styles';

const FooterWrapper = styled(Box)(({ theme }) => ({
  padding: '40px',
  backgroundColor: '#282d32',
  backgroundImage: 'url(/register/back1.png)',
  backgroundSize: '100% auto',
  backgroundPosition: 'bottom'
}));

const FooterBody = styled(Box)(({ theme }) => ({
	width: '100%',
	maxWidth: '1300px',
	margin: '0 auto',
  textTransform: 'uppercase',
	[theme.breakpoints.down('md')]: {
    textAlign: 'center',
  },
}));

const SocialLink = styled('a')(({ theme }) => ({
	margin: '0 10px',
	fontSize: '20px'
}));

export default function Footer() {
  return (
    <FooterWrapper>
    	<FooterBody>
    		<Box display='flex' justifyContent='space-around'>
	    		<Stack direction='row' sx={{mt: 4}}>
	  				<SocialLink href="/">
	  					<FaFacebookSquare />
	  				</SocialLink>
	  				<SocialLink href="/">
	  					<FaDiscord />
	  				</SocialLink>
	  				<SocialLink href="/">
	  					<FaTwitter />
	  				</SocialLink>
	  				<SocialLink href="/">
	  					<FaTelegramPlane />
	  				</SocialLink>
					</Stack>
    		</Box>
    		<Stack>
  				<Typography variant="p" component="p" align='center' color='#c9cacc' sx={{textTransform: 'initial', mt: 1}}>
            All trademarks referenced herein are theproperties of their
          </Typography>
          <Typography variant="p" component="p" align='center' color="#c9cacc" sx={{textTransform: 'initial'}}>
            respective owner. Copyright © 2007-2021 All Rights Reserved.
          </Typography>
				</Stack>
    	</FooterBody>
  	</FooterWrapper>
  );
}
