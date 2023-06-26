import styled from '@emotion/styled';
import { Container, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { AddProjectForm } from '../../components/forms/AddProjectForm';

const StyledMain = styled.main({
  minHeight: "60vh",
  backgroundColor: "#f6f6f6"
})

const ProjectAdmin: NextPage<{ projects: Project[] }> = ( data ) => {
  
  const [projects] = useState<Project[]>(data.projects)


  return (
  <StyledMain>
    <Container sx={{ pt: 10, pb: 10 }}>
      <Typography variant={"h4"}>Project Table</Typography>
      <ProjectTable projects={projects}/>
      <AddProjectForm />
    </Container>
  </StyledMain>
  );
};

export const getServerSideProps = async (ctx: any) => {
      const res = await fetch(`${process.env.API_URL}/project`);
      const projects = (await res.json()) as Project[];
  
    return {
      props: {
          projects,
        ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
      }
    };
};

export default ProjectAdmin;
