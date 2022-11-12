import { Box, Container, Divider, Grid, Stack, Tab, Tabs, Typography, Paper } from '@mui/material';
import type { GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import ProjectCarousel from '../../components/projectCarousel/ProjectCarousel';
import { TabPanel } from '../../components/tabpanel/tabpanel';

const ProjectDetails: NextPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container component="main" sx={{ pt: 10, pb: 10 }}>
      <Box sx={{ pb: 15 }}>
        <Typography variant="h4" component="h1" textAlign="right">
          Nome do Projeto
        </Typography>
        <Divider />
      </Box>
      <Grid container justifyContent={'center'}>
        <Grid item style={{ width: '600px' }}>
          <ProjectCarousel />
        </Grid>
      </Grid>
      <Paper>
        <Box pt={4} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Características" />
            <Tab label="Inscrição" />
            <Tab label="Atualizações" />
            <Tab label="Localização" />
          </Tabs>
        </Box>
        <Grid container p={5}>
          <TabPanel index={0} value={value}>
            <Stack spacing={2}>
              <Typography>Área Interior: 41 m2</Typography>
              <Typography>Casas de Banho: 2</Typography>
              <Typography>Área Exterior: 41 m2</Typography>
            </Stack>
          </TabPanel>
          <TabPanel index={1} value={value}>
            <Stack spacing={2}>
              <Typography>Área Interior: 41 m2</Typography>
            </Stack>
          </TabPanel>
          <TabPanel index={2} value={value}>
            <Stack spacing={2}>
              <Typography>Área Exterior: 41 m2</Typography>
            </Stack>
          </TabPanel>
        </Grid>
      </Paper>
    </Container>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
  }
});

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [
      { params: { projectId: '1' }, locale: 'en' },
      { params: { projectId: '1' }, locale: 'pt' },
      { params: { projectId: '2' } }
    ],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: false
  };
};

export default ProjectDetails;
