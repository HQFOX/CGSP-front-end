import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import construcao3 from '../../public/construcao3.jpg';

export const GradientBox = styled(Box)(({ theme }) => ({
	position: 'absolute',
	top: 0,
	[theme.breakpoints.up('xs')]: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 15%, rgba(25, 118, 210, 0) 100%)`
	},
	[theme.breakpoints.up('md')]: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 45%, rgba(25, 118, 210, 0) 100%)`
	},
	width: '100%',
	height: '100%'
}));

export const ImageBox = styled(Box)({
	backgroundPosition: 'right',
	position: 'absolute',
	width: '100%',
	height: '100%'
});
