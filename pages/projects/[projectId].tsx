import React, { useState } from 'react';

import { LatLngTuple } from 'leaflet';
import { NextPage } from 'next';

import {
  ArrowBackIosNew,
  Bathtub,
  Dashboard,
  Euro,
  ExpandMore,
  Garage,
  Hotel,
  OpenInNew,
  SquareFoot
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { StyledButton } from '../../components/Button';
import { Title } from '../../components/Title';
import { Details } from '../../components/details/Details';
import { Loading } from '../../components/loading/Loading';
import { EnrollmentModal } from '../../components/modals/enrollmentModal/enrollmentModal';
import { PageContainer } from '../../components/pageContainer/PageContainer';
import { ProjectCarousel } from '../../components/projects/projectCarousel/ProjectCarousel';
import TabPanel from '../../components/tabpanel/TabPanel';
import { UpdateStepper } from '../../components/updateStepper/UpdateStepper';
import theme from '../../theme';
import { LotCounter } from '../../components/lotCounter/LotCounter';

const Map = dynamic(() => import('../../components/map/Map'), {
  ssr: false,
  loading: () => <Loading />
});

const StyledTab = styled(Tab)({
  textTransform: 'capitalize'
});

const StyledTypography = styled(Typography)({
  display: 'flex',
  alignItems: 'end'
});

const ProjectDetails: NextPage<{ project: Project; updates: Update[] }> = (data) => {
  const { t } = useTranslation(['projectpage', 'common']);
  const [value, setValue] = useState(0);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState<boolean>(false);

  const router = useRouter();

  const project: Project = data.project;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEnrollmentModalClose = () => {
    setShowEnrollmentModal(false);
  };

  const allowEnrollment = project.assignmentStatus === "ONGOING"

  const showUpdatesPage = project.updates && project.updates.length > 0;

  return (
    <PageContainer>
      <Box sx={{ pb: 4 }}>
        <IconButton disableRipple onClick={() => router.back()} sx={{ paddingBottom: '13px' }}>
          <ArrowBackIosNew />
        </IconButton>
        <Title variant="h5" component="h1" fontSize={24} display={'inline-block'}>
          {project.title}
        </Title>
        <Divider />
      </Box>
      {project.coverPhoto && project.files && <ProjectCarousel project={project} />}
      <Paper sx={{ mt: 4, border: '1px solid rgb(237, 237, 237)', boxShadow: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <StyledTab label={t('tabsTitle.details')} />
            {allowEnrollment && <StyledTab label={t('tabsTitle.enroll')} />}
            <StyledTab label={t('tabsTitle.updates')} />
          </Tabs>
        </Box>
        <Grid container p={5}>
          <TabPanel index={0} value={value}>
            <Details project={project} />
            {project.typologies != null &&
              project.typologies.map((typology, index) => {
                return (
                  <Accordion
                    key={'typologyDetails' + index}
                    defaultExpanded={index == 0}
                    sx={{ border: '1px solid rgb(237, 237, 237)', boxShadow: 0 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`typology${index}-content`}
                      id={`typology${index}-header`}
                      sx={{ backgroundColor: theme.palette.secondary.light}}
                    >
                      <div style={{ display: "flex", alignItems: "center"}}>
                        <Typography marginRight={4}>{typology.typology}</Typography>
                        <LotCounter lots={typology.lots} assignedLots={typology.assignedLots}/>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container columnSpacing={4} columns={1}>
                        {typology.livingArea && typology.totalLotArea && (
                          <Grid item>
                            <Stack spacing={2}>
                              <Stack direction="row" gap={1}>
                                <SquareFoot color="primary" />
                                <StyledTypography variant="body2" color="text.secondary">
                                  {' '}
                                  {`${t('typologyDetails.area')}`}:{' '}
                                </StyledTypography>
                              </Stack>
                              {typology.livingArea && (
                                <StyledTypography
                                  variant="body2"
                                  color="text.secondary"
                                >{`${t('typologyDetails.interiorArea')}: ${
                                  typology.livingArea
                                } \u33A1`}</StyledTypography>
                              )}
                              {typology.totalLotArea && (
                                <StyledTypography
                                  variant="body2"
                                  color="text.secondary"
                                >{`${t('typologyDetails.exteriorArea')}: ${
                                  typology.totalLotArea
                                } \u33A1`}</StyledTypography>
                              )}
                            </Stack>
                          </Grid>
                        )}
                        {typology.bedroomNumber && (
                          <Grid item>
                            <Stack direction="row" gap={1}>
                              <Hotel color="primary" />
                              <StyledTypography
                                variant="body2"
                                color="text.secondary"
                              >{`${t('typologyDetails.bedrooms')}: ${
                                typology.bedroomNumber
                              }`}</StyledTypography>
                            </Stack>
                          </Grid>
                        )}
                        {typology.bathroomNumber && (
                          <Grid item>
                            <Stack direction="row" gap={1}>
                              <Bathtub color="primary" />
                              <StyledTypography
                                variant="body2"
                                color="text.secondary"
                              >{`${t('typologyDetails.bathrooms')}: ${
                                typology.bathroomNumber
                              }`}</StyledTypography>
                            </Stack>
                          </Grid>
                        )}
                        {typology.garageNumber && (
                          <Grid item>
                            <Stack direction="row" gap={1}>
                              <Garage color="primary" />
                              <StyledTypography
                                variant="body2"
                                color="text.secondary"
                              >{`${t('typologyDetails.garage')}: ${
                                typology.garageNumber
                              }`}</StyledTypography>
                            </Stack>
                          </Grid>
                        )}
                        {typology.price && (
                          <Grid item>
                            <Stack direction="row" gap={1}>
                              <Euro color="primary" />
                              <StyledTypography
                                variant="body2"
                                color="text.secondary"
                              >{`${t('typologyDetails.price')}: ${new Intl.NumberFormat('eu', {
                                style: 'currency',
                                currency: 'EUR'
                              }).format(typology.price)}`}</StyledTypography>
                            </Stack>
                          </Grid>
                        )}
                        {typology.plant && (
                          <Grid item>
                            <Stack direction="row" gap={1}>
                              <Dashboard color="primary" />
                              <MuiLink
                                href={`${process.env.NEXT_PUBLIC_S3_URL}${typology.plant?.filename}`}
                                target="_blank"
                                rel="noreferrer"
                                variant="body2"
                                color="text.secondary"
                              >
                                {t('typologyDetails.plant')}
                              </MuiLink>
                            </Stack>
                          </Grid>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </TabPanel>
          {allowEnrollment && <TabPanel index={1} value={value}>
            <Box>
              <Typography sx={{ textIndent: 20 }} color="text.secondary">
                {t('preEnrollDescription')}
              </Typography>
              <Grid container justifyContent={'flex-end'} paddingTop={4}>
                <Grid item sm={2}>
                  <StyledButton
                    variant="contained"
                    color="primary"
                    onClick={() => setShowEnrollmentModal(true)}
                  >
                    {t('preEnroll')}
                  </StyledButton>
                  <EnrollmentModal
                    open={showEnrollmentModal}
                    handleEnrollmentModalClose={handleEnrollmentModalClose}
                    project={project}
                  />
                </Grid>
              </Grid>
            </Box>
          </TabPanel>}
          <TabPanel index={2} value={value}>
            <UpdateStepper updates={data.project.updates} />
          </TabPanel>
        </Grid>
      </Paper>
      <Paper sx={{ mt: 4, border: '1px solid rgb(237, 237, 237)', boxShadow: 0 }}>
        <div id="map" style={{ height: 480 }}>
          <Map
            zoom={13}
            centerCoordinates={project.coordinates as LatLngTuple}
            markers={[project.coordinates] as LatLngTuple[]}
            popupContent={
              <Link
                target="_blank"
                href={`https://www.google.com/maps/search/?api=1&query=${project.coordinates?.[0]}%2C${project.coordinates?.[1]}`}
                passHref
              >
                <StyledButton endIcon={<OpenInNew />}>{t('map.googleMapsLink')}</StyledButton>
              </Link>
            }
          />
        </div>
      </Paper>
    </PageContainer>
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
