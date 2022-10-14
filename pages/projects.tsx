import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ProjectCard from '../components/projects/ProjectCard';

const projects: Project[] = [
  {
    title: 'LOTEAMENTO BRº DE ALMEIRIM - ÉVORA'
  },
  {
    title: 'Empreendimento São José da Ponte'
  },
  {
    title: 'Loteamento de Guadalupe'
  },
  {
    title: 'Monte dos Clérigos'
  }
];

const Projects: NextPage = () => (
  <Container component="main" sx={{ pt: 10, pb: 10 }}>
    <Box sx={{ pb: 15 }}>
      <Typography variant="h4" component="h1">
        On going Projects
      </Typography>
      <Divider />
    </Box>
    <Grid container>
      {projects.map((project, i) => (
        <Grid key={i} item xs={12} md={6} p={1}>
          <ProjectCard key={i} project={project} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer']))
  }
});

export default Projects;
