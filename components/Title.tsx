import React from 'react';

import { Typography, TypographyProps, styled } from '@mui/material';

const StyledTypography = styled(Typography)({
  fontWeight: 600,
  textTransform: 'capitalize'
});

export interface TitleProps extends TypographyProps {}

export const Title = (props: TitleProps) => {
  const { children, fontSize = 18, letterSpacing = -0.54, lineHeight = 1.8, ...others } = props;

  return (
    <StyledTypography
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      lineHeight={lineHeight}
      {...others}
    >
      {children}
    </StyledTypography>
  );
};
