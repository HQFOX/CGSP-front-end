import React from 'react';

import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { cx } from '@emotion/css'

import theme from '../../theme';
import { styles } from './styles';

const spinner = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const StyledSpinnerContainer = styled.div<LoadingProps>`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  height: ${(props) => props.height};
`;

const StyledSpinner = styled('div')({
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3' /* Light grey */,
  borderTop: `5px solid ${theme.palette.primary.main}` /* Black */,
  borderRadius: '50%',
  animation: `${spinner} 1.5s linear infinite`
});

type LoadingProps = {
  height?: string;
  icon?: boolean;
};

export const Loading = ({ height, icon = false}: LoadingProps) => (
  <StyledSpinnerContainer height={height} className="">
    <StyledSpinner className={cx({ [styles.spinerIcon]: icon})}></StyledSpinner>
  </StyledSpinnerContainer>
);
