import { Box, Container, Divider, Grid, Stack, Tab, Tabs, Typography, Paper, Button } from '@mui/material';
import type { GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrollmentModal } from '../../components/modals/enrollmentModal/enrollmentModal';
import ProjectCarousel from '../../components/projectCarousel/ProjectCarousel';
import TabPanel from '../../components/tabpanel/TabPanel';
import { UpdateStepper } from '../../components/updateStepper/UpdateStepper';

const ProjectDetails: NextPage = () => {
  const { t, i18n } = useTranslation(['projectpage', 'common']);
  const [value, setValue] = useState(0);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState<boolean>(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEnrollmentModalClose = () => {
    setShowEnrollmentModal(false)
  }

  return (
    <Container component="main" sx={{ pt: 10, pb: 10 , backgroundColor: "lightgray"}}>
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
      <Paper sx={{ mt: 4}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
            <Box>
              <Typography>Id labore officia amet consectetur aliqua culpa incididunt cillum non duis pariatur. Labore pariatur cillum sit ad reprehenderit eiusmod esse consequat ullamco ullamco. Commodo voluptate veniam veniam nulla non aute culpa ea irure amet sint exercitation. Ipsum labore magna sint incididunt sint adipisicing esse nisi minim non deserunt. Nulla eiusmod magna et enim dolor ullamco mollit ea aute ex magna non. Do sit ut adipisicing do minim quis labore id ea tempor sint est. Ad qui cillum amet anim ad.<br/>

In est quis minim esse eu aliquip nostrud labore sunt adipisicing adipisicing. Pariatur aute ad deserunt ut consequat laboris ut voluptate laboris fugiat sint. Eu aute ex ipsum occaecat consectetur reprehenderit cupidatat sunt. Dolore nisi ullamco cillum mollit cillum Lorem. Cillum quis magna veniam officia voluptate Lorem nisi culpa sit consequat excepteur cupidatat. Labore anim eu tempor quis duis fugiat ullamco ipsum adipisicing consequat excepteur. Fugiat mollit aute nulla veniam cillum qui occaecat deserunt pariatur id laborum cillum adipisicing culpa.
              </Typography>
              <Grid container justifyContent={"flex-end"} paddingTop={4}>
                <Grid item sm={2} >
                  <Button variant='contained' color='primary' onClick={() => setShowEnrollmentModal(true)}>Pre-Enroll</Button>
                  <EnrollmentModal open={showEnrollmentModal} handleEnrollmentModalClose={handleEnrollmentModalClose} />
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel index={2} value={value}>
              <UpdateStepper />
          </TabPanel>
        </Grid>
      </Paper>
    </Container>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['projectpage','common', 'footer', 'header']))
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
