import styled from '@emotion/styled';
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { AccountBox, Analytics, ArrowBackIosNew, Feed, Foundation } from '@mui/icons-material';
import Link from 'next/link';
import { VerticalNavigation } from '../../components/vesticalNavigation/VerticalNavigation';

const StyledMain = styled.main({
  minHeight: '80vh',
  backgroundColor: '#f6f6f6'
});


const DashBoard: NextPage = () => {

  return (
    <>
      <StyledMain>
        <Container sx={{ pt: 10, pb: 10 }}>
          <h3>hello world from admin dashboard</h3>
          {/* <Button onClick={() => setOpen(!open)}>open naviagtion</Button> */}
        </Container>
      </StyledMain>
    </>
  );
};

export const getServerSideProps = async (ctx: any) => {
  //   const res = await fetch(`http://localhost:8080/project`);
  //   const projects = (await res.json()) as Project[];

  return {
    props: {
      //   projects,
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
    }
  };
};

export default DashBoard;
