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
  backgroundPosition: 'bottom',
  backgroundRepeat: 'no-repeat',
  [theme.breakpoints.down('md')]: {
    backgroundSize: 'auto 260%'
  }
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
    		<Grid container>
    			<Grid item xs={12} md={3}>
    				<Stack>
	    				<Typography variant="p" component="p" fontWeight={800} color='white' sx={{mb: 2}}>
	              Services
	            </Typography>
    					<a href="/" target='_blank'>
		            <Typography variant="p" component="p" sx={{mb: 1}}>
		              Game Download
		            </Typography>
		          </a>
    					<a href="/" target='_blank'>
		            <Typography variant="p" component="p" sx={{mb: 1}}>
		              Binance Wallet
		            </Typography>
		          </a>
    					<a href="/" target='_blank'>
		            <Typography variant="p" component="p">
		              Metamask Wallet
		            </Typography>
		          </a>
    				</Stack>
    			</Grid>
    			<Grid item xs={12} md={3} sx={{mt: {md: 0, xs: 4}}}>
    				<Stack>
	    				<Typography variant="p" component="p" fontWeight={800} color='white' sx={{mb: 2}}>
	              About
	            </Typography>
    					<a href="https://docs.ymircoin.com" target='_blank'>
		            <Typography variant="p" component="p" sx={{mb: 1}}>
		              Whitepaper
		            </Typography>
		          </a>
    					<a href="https://ymir.exchange" target='_blank'>
		            <Typography variant="p" component="p" sx={{mb: 1}}>
		              Ymir Exchange
		            </Typography>
		          </a>
    					<a href="/" target='_blank'>
		            <Typography variant="p" component="p">
		              Privacy Policy
		            </Typography>
		          </a>
    				</Stack>
    			</Grid>
    			<Grid item xs={12} md={6} sx={{mt: {md: 0, xs: 4}}}>
    				<Stack>
	    				<Typography variant="p" component="p" fontWeight={800} color='white' sx={{mb: 2}}>
	              YmirCoin Community
	            </Typography>
	            <Typography variant="p" component="p" color="#c9cacc" sx={{mb: 1}}>
	              Be part ouf our growing community with our social media platforms. Click Icons below
	            </Typography>
    				</Stack>
    			</Grid>
    		</Grid>
    		<Box display='flex' justifyContent='space-around'>
	    		<Stack direction='row' sx={{mt: 4}}>
	  				<SocialLink href="https://www.facebook.com/RagnarokSarahServerOfficial" target='_blank'>
	  					<FaFacebookSquare />
	  				</SocialLink>
	  				<SocialLink href="https://discord.gg/UTWu242eZg" target='_blank'>
	  					<FaDiscord />
	  				</SocialLink>
	  				<SocialLink href="https://twitter.com/YmirCoin" target='_blank'>
	  					<FaTwitter />
	  				</SocialLink>
	  				<SocialLink href="https://t.me/YmirCoinOfficial" target='_blank'>
	  					<FaTelegramPlane />
	  				</SocialLink>
					</Stack>
    		</Box>
    		<Stack>
  				<Typography variant="p" component="p" align='center' color='#c9cacc' sx={{textTransform: 'initial', mt: 1}}>
            All trademarks referenced herein are the properties of their
          </Typography>
          <Typography variant="p" component="p" align='center' color="#c9cacc" sx={{textTransform: 'initial'}}>
            respective owner. Copyright © 20021-2022 All Rights Reserved.
          </Typography>
				</Stack>
    	</FooterBody>
  	</FooterWrapper>
  );
}
