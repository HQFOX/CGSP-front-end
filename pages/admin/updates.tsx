import styled from '@emotion/styled';
import { Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UpdateTable } from '../../components/updates/UpdateTable';
import { AddUpdateForm } from '../../components/forms/AddUpdateForm';
import { useState } from 'react';


const StyledMain = styled.main({
  minHeight: "70vh",
  backgroundColor: "#f6f6f6"
})

const UpdateAdmin: NextPage<{updates: Update[], projects: Project[] }> = ( data ) => {
  const [updates, setUpdates] = useState<Update[]>(data.updates)

  return (
    <StyledMain>
      <Container sx={{ pt: 10, pb: 10 }}>
        <Typography variant={"h4"}>Update Table</Typography>
        <UpdateTable updates={updates}/>
        <AddUpdateForm projects={data.projects}/>
      </Container>
    </StyledMain>
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
