import {
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import type { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnrollmentModal } from '../../components/modals/enrollmentModal/enrollmentModal';
import ProjectCarousel from '../../components/projectCarousel/ProjectCarousel';
import TabPanel from '../../components/tabpanel/TabPanel';
import { UpdateStepper } from '../../components/updateStepper/UpdateStepper';
import dynamic from 'next/dynamic';
import { Loading } from '../../components/loading/Loading';
import { Bathtub, ExpandMore, SquareFoot } from '@mui/icons-material';
import styled from '@emotion/styled';

const Map = dynamic(() => import('../../components/map/Map'), {
  ssr: false,
  loading: () => <Loading />
});

const StyledMain = styled.main({
  minHeight: '70dvh',
  backgroundColor: '#f6f6f6'
});

const ProjectDetails: NextPage<{ project: Project, updates: Update[] }> = (data) => {
  const { t, i18n } = useTranslation(['projectpage', 'common']);
  const [value, setValue] = useState(3);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState<boolean>(false);

  const project: Project = data.project;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEnrollmentModalClose = () => {
    setShowEnrollmentModal(false);
  };

  return (
    <StyledMain>
      <Container sx={{ pt: 10, pb: 10 }}>
        <Box sx={{ pb: 15 }}>
          <Typography variant="h4" component="h1" textAlign="right">
            {project.title}
          </Typography>
          <Divider />
        </Box>
        <ProjectCarousel project={project}/>
        <Paper sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label={t('tabsTitle.details')} />
              <Tab label={t('tabsTitle.enroll')} />
              <Tab label={t('tabsTitle.updates')} />
              <Tab label={t('tabsTitle.location')} />
            </Tabs>
          </Box>
          <Grid container p={5}>
            <TabPanel index={0} value={value}>
              {project.typologies != null &&
                project.typologies.map((typology, index) => {
                  return (
                    <Accordion key={'typologyDetails' + index} defaultExpanded={index == 0}>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <Typography>{typology.typology}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          <Stack direction="row" gap={1}>
                            <SquareFoot />
                            <Typography>{`${t('typologyDetails.interiorArea')}: ${
                              typology.bathroomNumber
                            } m2`}</Typography>
                          </Stack>
                          <Stack direction="row" gap={1}>
                            <Bathtub />
                            <Typography>{`${t('typologyDetails.bathrooms')}: ${
                              typology.bathroomNumber
                            }`}</Typography>
                          </Stack>
                          <Stack direction="row" gap={1}>
                            <SquareFoot />
                            <Typography>{`${t('typologyDetails.exteriorArea')}: ${
                              typology.bathroomNumber
                            } m2`}</Typography>
                          </Stack>
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
            </TabPanel>
            <TabPanel index={1} value={value}>
              <Box>
                <Typography>
                  Id labore officia amet consectetur aliqua culpa incididunt cillum non duis
                  pariatur. Labore pariatur cillum sit ad reprehenderit eiusmod esse consequat
                  ullamco ullamco. Commodo voluptate veniam veniam nulla non aute culpa ea irure
                  amet sint exercitation. Ipsum labore magna sint incididunt sint adipisicing esse
                  nisi minim non deserunt. Nulla eiusmod magna et enim dolor ullamco mollit ea aute
                  ex magna non. Do sit ut adipisicing do minim quis labore id ea tempor sint est. Ad
                  qui cillum amet anim ad.
                  <br />
                  In est quis minim esse eu aliquip nostrud labore sunt adipisicing adipisicing.
                  Pariatur aute ad deserunt ut consequat laboris ut voluptate laboris fugiat sint.
                  Eu aute ex ipsum occaecat consectetur reprehenderit cupidatat sunt. Dolore nisi
                  ullamco cillum mollit cillum Lorem. Cillum quis magna veniam officia voluptate
                  Lorem nisi culpa sit consequat excepteur cupidatat. Labore anim eu tempor quis
                  duis fugiat ullamco ipsum adipisicing consequat excepteur. Fugiat mollit aute
                  nulla veniam cillum qui occaecat deserunt pariatur id laborum cillum adipisicing
                  culpa.
                </Typography>
                <Grid container justifyContent={'flex-end'} paddingTop={4}>
                  <Grid item sm={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowEnrollmentModal(true)}>
                      Pre-Enroll
                    </Button>
                    <EnrollmentModal
                      open={showEnrollmentModal}
                      handleEnrollmentModalClose={handleEnrollmentModalClose}
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel index={2} value={value}>
              <UpdateStepper updates={data.project.updates} />
            </TabPanel>
            <TabPanel index={3} value={value}>
              <Box>
                <div id="map" style={{ height: 480 }}>
                  <Map centerCoordinates={project.coordinates} markers={[project.coordinates]} />
                </div>
              </Box>
            </TabPanel>
          </Grid>
        </Paper>
      </Container>
    </StyledMain>
  );
};

export const getServerSideProps = async (context: any) => {
  const id = context.params.projectId;
  const projectRes = await fetch(`${process.env.API_URL}/project/${id}`);
  const project = (await projectRes.json()) as Project;

  return {
    props: {
      project,
      ...(await serverSideTranslations(context.locale, [
        'common',
        'footer',
        'header',
        'projectpage'
      ]))
    }
  };
};

export default ProjectDetails;
