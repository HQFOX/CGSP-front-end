import React from 'react';

import type { NextPage } from 'next';

import { Box, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Title } from '../components/Title';
import { PageContainer } from '../components/pageContainer/PageContainer';
import Updates from '../components/updates/Update';

const UpdatePage: NextPage<{ updates: Update[] }> = (data) => {
  const { t } = useTranslation(['common']);

  return (
    <PageContainer>
      <Box sx={{ p: 2, pb: 4 }}>
        <Title variant="h5" component="h1" fontSize={24}>
          {t('updates')}
        </Title>
        <Divider />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Updates updates={data.updates} />
      </Box>
    </PageContainer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
  const res = fetch(`${process.env.API_URL}/update`).then((res) => {
    if (res.ok) {
      return res.json().then((data) => data);
    }
    console.error('Error fetching updates');
  });

  const updates = res ? ((await res) as Update[]) : [];
  return {
    props: {
      updates,
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'homepage']))
    }
  };
};

export default UpdatePage;
