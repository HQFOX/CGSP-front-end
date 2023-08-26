import { Typography } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UpdateTable } from '../../components/updates/UpdateTable';
import { AddUpdateForm } from '../../components/forms/AddUpdateForm';
import { useState } from 'react';
import { PageContainer } from '../../components/pageContainer/PageContainer';

const UpdateAdmin: NextPage<{ updates: Update[]; projects: Project[] }> = (data) => {
  const [updates, setUpdates] = useState<Update[]>(data.updates);

  return (
    <PageContainer>
      <Typography variant={'h4'}>Update Table</Typography>
      <UpdateTable updates={updates} />
      <AddUpdateForm projects={data.projects} />
    </PageContainer>
  );
};

export const getServerSideProps = async (ctx: any) => {
  const res = await fetch(`${process.env.API_URL}/update`);
  const updates = (await res.json()) as Update[];

  const projectRes = await fetch(`${process.env.API_URL}/project`);
  const projects = (await projectRes.json()) as Project[];

  return {
    props: {
      updates,
      projects,
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
    }
  };
};

export default UpdateAdmin;
