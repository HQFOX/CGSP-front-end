import React, { Suspense, useState } from 'react';

import type { NextPage } from 'next';

import { Add } from '@mui/icons-material';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { StyledButton } from '../../components/Button';
import { ProjectForm } from '../../components/forms/ProjectForm';
import { useFetch } from '../../components/forms/utils';
import { Loading } from '../../components/loading/Loading';
import { PageContainer } from '../../components/pageContainer/PageContainer';
import { ProjectTable } from '../../components/tables/ProjectTable';

const ProjectAdmin: NextPage<{ projects: Project[] }> = (data) => {
  const [projects, setProjects] = useState<Project[]>(data.projects);
  const [editProject, setEditProject] = useState<Project | undefined>();
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showEditProjectForm, setShowEditProjectForm] = useState(false);

  const refreshData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`);
    if (res.status == 200) {
      const projects = (await res.json()) as Project[];

      setProjects(projects);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (id) {
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/project/${id}`;

      await useFetch('DELETE', endpoint, undefined, true)
        .then((response) => {
          if (response.ok) {
            refreshData();
          } else {
            throw new Error('Project Delete ' + response.status);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleShowProjectForm = (project: Project) => {
    setEditProject(project);
    setShowEditProjectForm(true);
    window.document.getElementById('editprojectform')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <Box sx={{ pb: 4 }}>
        <Typography variant="h5" component="h1">
          Projetos
        </Typography>
        <Divider />
      </Box>
      {!showAddProjectForm && (
        <Grid container mt={2} mb={2}>
          <Grid item>
            <StyledButton
              startIcon={<Add />}
              variant="contained"
              onClick={() => setShowAddProjectForm(true)}
              disabled={showAddProjectForm || showEditProjectForm}
            >
              Adicionar Projecto
            </StyledButton>
          </Grid>
        </Grid>
      )}
      <ProjectTable
        projects={projects}
        handleShowProjectForm={handleShowProjectForm}
        handleDelete={handleDelete}
      />
      {showAddProjectForm && (
        <Suspense fallback={<Loading />}>
          <ProjectForm onCancel={() => setShowAddProjectForm(false)} onSubmit={refreshData} />
        </Suspense>
      )}
      <div id="editprojectform">
        {showEditProjectForm && (
          <Suspense fallback={<Loading />}>
            <ProjectForm
              project={editProject}
              onCancel={() => setShowEditProjectForm(false)}
              onSubmit={refreshData}
            />
          </Suspense>
        )}
      </div>
    </PageContainer>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
  const res = await fetch(`${process.env.API_URL}/project`);
  const projects = (await res.json()) as Project[];

  return {
    props: {
      projects,
      ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'projectpage']))
    }
  };
};

export default ProjectAdmin;
