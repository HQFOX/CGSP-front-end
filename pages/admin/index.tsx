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
import { PageContainer } from '../../components/pageContainer/PageContainer';

const DashBoard: NextPage = () => {
  return <h3>hello world from admin dashboard</h3>;
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
