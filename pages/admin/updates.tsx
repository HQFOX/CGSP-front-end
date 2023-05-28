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

const UpdateAdmin: NextPage<{updates: Update[] }> = ( data ) => {
  const [updates, setUpdates] = useState<Update[]>(data.updates)

  return (
    <StyledMain>
      <Container sx={{ pt: 10, pb: 10 }}>
        <Typography variant={"h4"}>Update Table</Typography>
        <UpdateTable updates={updates}/>
        <AddUpdateForm />
      </Container>
    </StyledMain>
    );
};

export const getServerSideProps = async (ctx: any) => {
      const res = await fetch(`http://localhost:8080/update`);
      const updates = (await res.json()) as Update[];
  
    return {
      props: {
          updates,
        ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
      }
    };
  };

export default UpdateAdmin;
