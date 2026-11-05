import React from 'react';

import { Typography, TypographyProps, styled } from '@mui/material';

const StyledTypography = styled(Typography)({
	fontWeight: 600,
	textTransform: 'capitalize'
});

export interface TitleProps extends TypographyProps {
	fontSize?: React.CSSProperties['fontSize'];
	letterSpacing?: React.CSSProperties['letterSpacing'];
	lineHeight?: React.CSSProperties['lineHeight'];
}

export const Title = (props: TitleProps) => {
	const { children, fontSize = 18, letterSpacing = -0.54, lineHeight = 1.8, sx, ...others } = props;

	return (
		<StyledTypography
			sx={[{ fontSize, letterSpacing, lineHeight }, ...(Array.isArray(sx) ? sx : [sx])]}
			{...others}>
			{children}
		</StyledTypography>
	);
};
