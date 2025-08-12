import React, { Suspense, useState } from 'react';

import type { NextPage } from 'next';

import { Box, Divider, Grid2 as Grid, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { ProjectForm } from '../../../components/forms/ProjectForm';
import { Loading } from '../../../components/loading/Loading';
import { PageContainer } from '../../../components/pageContainer/PageContainer';


const ProjectCreateAdmin: NextPage<{ projects: Project[] }> = (data) => {

  return (
    <PageContainer>
      <Box sx={{ pb: 4 }}>
        <Typography variant="h5" component="h1">
          Projetos
        </Typography>
        <Divider />
      </Box>
        <Suspense fallback={<Loading />}>
          <ProjectForm />
        </Suspense>
    </PageContainer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
    }
  };
};

export default ProjectCreateAdmin;
