import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import { ProjectInventory } from '../components/projects/projectInventory/ProjectInventory';

export const normalizeString = (value: string): string => {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export type ViewType = 'card' | 'list' | 'map';

const Projects: NextPage<{ projects: Project[] }> = (data) => {
  const { t } = useTranslation(['projectpage', 'common']);

  return (
    <PageContainer>
      <Box sx={{ p: 2, pb: 4 }}>
        <Title variant="h5" component="h1" fontSize={24}>
          {t('projectPageTitle')}
        </Title>
        <Divider />
      </Box>
      <ProjectInventory projects={data.projects} />
    </PageContainer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
  const res = await fetch(`${process.env.API_URL}/project/current`).then((res) => {
    if (res.ok) {
      return res.json().then((data) => data);
    }
    console.error('Error fetching projects');
  });
  const projects = (await res) ?? [];
  return {
    props: {
      projects,
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
    }
  };
};

export default Projects;
