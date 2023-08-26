import React from "react";
import styled from "@emotion/styled";
import { Container } from "@mui/material";
import { ReactNode } from "react";
import theme from "../../theme";

const StyledMain = styled.main({
	minHeight: "70dvh",
	backgroundColor: theme.bg.main
});

export const PageContainer = ({children}: {children?: ReactNode}) => {
	return (
		<StyledMain>
			<Container sx={{ pt: 10, pb: 10 }}>
				{children}
			</Container>
		</StyledMain>
	);
};