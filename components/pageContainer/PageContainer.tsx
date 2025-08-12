import React from 'react';
import { ReactNode } from 'react';

import styled from '@emotion/styled';
import { Container } from '@mui/material';

import theme from '../../theme';

const StyledMain = styled.main({
	minHeight: '90dvh',
	backgroundColor: theme.bg.main
});

export const PageContainer = ({
	children,
	admin = false
}: {
	children?: ReactNode;
	admin?: boolean;
}) => {
	return (
		<StyledMain>
			<Container sx={{ pt: 10, pb: 10 }} maxWidth={admin ? 'xl' : 'lg'}>
				{children}
			</Container>
		</StyledMain>
	);
};
