import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import { ProjectInventory } from '../components/projects/projectInventory/ProjectInventory';

const History: NextPage<{ projects: Project[] }> = (data) => {
  const { t } = useTranslation(['history', 'projectpage', 'common']);

  return (
    <PageContainer>
      <Box sx={{ p: 2, pb: 4 }}>
        <Title variant="h5" component="h1" fontSize={24}>
          {t('historyTitle')}
        </Title>
        <Divider />
        <Typography sx={{ pt: 2 }} variant="body2" color="text.secondary">
          {t('historyP1')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('historyP2')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('historyP3')}
        </Typography>
      </Box>
      <ProjectInventory projects={data.projects} history />
    </PageContainer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
  const res = await fetch(`${process.env.API_URL}/project/history`).then((res) => {
    if (res.ok) {
      return res.json().then((data) => data);
    }
    console.error('Error fetching projects');
  });
  const projects = res ? ((await res) as Project[]) : [];
  return {
    props: {
      projects,
      ...(await serverSideTranslations(ctx.locale, [
        'common',
        'footer',
        'header',
        'projectpage',
        'history'
      ]))
    }
  };
};

export default History;
