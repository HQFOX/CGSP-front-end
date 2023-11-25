import { Typography, TypographyProps, styled } from "@mui/material";
import React from "react";

const StyledTypography = styled(Typography)({
	fontWeight: 600,
	textTransform: "capitalize",
	lineHeight: 1.8
});

export interface TitleProps extends TypographyProps {}

export const Title = (props : TitleProps) => {
	const {
		children,
		fontSize = 18,
		letterSpacing = -0.54,
		...others
	} = props;

	return <StyledTypography fontSize={fontSize} letterSpacing={letterSpacing} {...others}>{children}</StyledTypography>;
};