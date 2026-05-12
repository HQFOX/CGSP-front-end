import { Box, SxProps } from '@mui/material';

export const HomeSection = ({
	color,
	sx,
	children
}: {
	color?: string;
	sx?: SxProps;
	children: React.ReactElement[] | React.ReactElement;
}) => {
	return (
		<Box sx={{ backgroundColor: color, pt: 8, pb: 8, ...sx }}>
			<Box
				sx={(theme) => ({
					[theme.breakpoints.up('md')]: {
						paddingLeft: theme.spacing(15),
						paddingRight: theme.spacing(15)
					},
					[theme.breakpoints.down('md')]: {
						paddingLeft: theme.spacing(5),
						paddingRight: theme.spacing(15)
					},
					pt: 6,
					pb: 6
				})}>
				{children}
			</Box>
		</Box>
	);
};
