import styled from '@emotion/styled';
import { Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { EnrollRequestTable } from '../../components/enrollrequests/EnrollRequestTable';

const StyledMain = styled.main({
  minHeight: "70vh",
  backgroundColor: "#f6f6f6"
})

const EnrollRequestsAdmin: NextPage<{ requests: EnrollRequest[] }> = (data) => {
  return (
    <StyledMain>
    <Container sx={{ pt: 10, pb: 10 }}>
      <Typography variant={"h4"}>Enroll Request Table</Typography>
      <EnrollRequestTable requests={data.requests}/>
    </Container>
  </StyledMain>
  );
};

export const getServerSideProps = async (ctx: any) => {
    const res = await fetch(`http://localhost:8080/enroll`);
    const requests = (await res.json()) as EnrollRequest[];

  return {
    props: {
        requests,
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
    }
  };
};

export default EnrollRequestsAdmin;
