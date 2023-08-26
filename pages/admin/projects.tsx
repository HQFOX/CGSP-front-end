import { Button, Grid, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Suspense, useState } from 'react';
import { ProjectTable } from '../../components/projects/ProjectTable';
import { AddProjectForm } from '../../components/forms/AddProjectForm';
import { Add } from '@mui/icons-material';
import { Loading } from '../../components/loading/Loading';
import { PageContainer } from '../../components/pageContainer/PageContainer';

const ProjectAdmin: NextPage<{ projects: Project[] }> = (data) => {
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);

  const [projects, setProjects] = useState<Project[]>(data.projects);

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`);
    if (res.status == 200) {
      const projects = (await res.json()) as Project[];

      setProjects(projects);
    }
  };

  return (
    <PageContainer>
      <Typography variant={'h4'} mb={2}>Project Table</Typography>
      <ProjectTable projects={projects}/>
      {!showAddProjectForm && (
        <Grid container direction={'row-reverse'} mt={2}>
          <Grid item>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => setShowAddProjectForm(true)}>
              Add Project
            </Button>
          </Grid>
        </Grid>
      )}
      {showAddProjectForm && (
        <Suspense fallback={<Loading />}>
          <AddProjectForm
            onCancel={() => setShowAddProjectForm(false)}
            onSubmit={() => handleSubmit()}
          />
        </Suspense>
      )}
    </PageContainer>
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
