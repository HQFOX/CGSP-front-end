/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";

import {
	Box,
	Divider,
	Grid,
	Stack,
	Tab,
	Tabs,
	Typography,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	styled
} from "@mui/material";

import {
	Bathtub,
	Dashboard,
	Euro,
	ExpandMore,
	Garage,
	Home,
	HomeWork,
	Hotel,
	HowToReg,
	SquareFoot
} from "@mui/icons-material";

import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";

import { EnrollmentModal } from "../../components/modals/enrollmentModal/enrollmentModal";
import ProjectCarousel from "../../components/projects/projectCarousel/ProjectCarousel";
import TabPanel from "../../components/tabpanel/TabPanel";
import { UpdateStepper } from "../../components/updateStepper/UpdateStepper";
import { Loading } from "../../components/loading/Loading";
import { PageContainer } from "../../components/pageContainer/PageContainer";
import { StyledButton } from "../../components/Button";
import { LatLngTuple } from "leaflet";
import { Details } from "../../components/details/Details";
import theme from "../../theme";
import { Title } from "../../components/Title";

const Map = dynamic(() => import("../../components/map/Map"), {
	ssr: false,
	loading: () => <Loading />
});

const StyledTab = styled(Tab)({
	textTransform: "capitalize"
});

const StyledTypography = styled(Typography)({
	display: "flex",
	alignItems: "end"
});

const ProjectDetails: NextPage<{ project: Project; updates: Update[] }> = (data) => {
	const { t } = useTranslation(["projectpage", "common"]);
	const [value, setValue] = useState(0);
	const [showEnrollmentModal, setShowEnrollmentModal] = useState<boolean>(false);

	const project: Project = data.project;

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const handleEnrollmentModalClose = () => {
		setShowEnrollmentModal(false);
	};

	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{project.title}
				</Title>
				<Divider />
			</Box>
			<ProjectCarousel project={project} />
			<Paper sx={{ mt: 4, border: "1px solid rgb(237, 237, 237)", boxShadow: 0 }}>
				<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
					<Tabs value={value} onChange={handleChange}>
						<StyledTab label={t("tabsTitle.details")} />
						<StyledTab label={t("tabsTitle.enroll")} />
						<StyledTab label={t("tabsTitle.updates")} />
						{/* <StyledTab label={t("tabsTitle.location")} /> */}
					</Tabs>
				</Box>
				<Grid container p={5}>
					<TabPanel index={0} value={value}>
						<Details project={project} />
              			{/* <StyledTypography variant="body2" color="text.secondary">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              			</StyledTypography> */}
						{project.typologies != null &&
              project.typologies.map((typology, index) => {
              	return (
              			<Accordion key={"typologyDetails" + index} defaultExpanded={index == 0} sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
              				<AccordionSummary
              					expandIcon={<ExpandMore />}
              					aria-controls="panel1a-content"
              					id="panel1a-header"
              					sx={{ backgroundColor: theme.palette.secondary.light}}
              				>
              					<Typography>{typology.typology}</Typography>
              				</AccordionSummary>
              				<AccordionDetails>
              					<Grid container columnSpacing={4} columns={1}>
              						<Grid item>
              							<Stack spacing={2}>
              								<Stack direction="row" gap={1}>
              									<SquareFoot color="primary" />
              									<StyledTypography variant="body2" color="text.secondary"> {`${t("typologyDetails.area")}`}: </StyledTypography>
              								</Stack>
              								<StyledTypography variant="body2" color="text.secondary">{`${t("typologyDetails.interiorArea")}: ${
              									typology.bathroomNumber
              								} \u33A1`}</StyledTypography>
              								<StyledTypography variant="body2" color="text.secondary">{`${t("typologyDetails.exteriorArea")}: ${
              									typology.bathroomNumber
              								} \u33A1`}</StyledTypography>
              							</Stack>
              						</Grid>
              						<Grid item>
              							<Stack direction="row" gap={1}>
              								<Hotel color="primary" />
              								<StyledTypography variant="body2" color="text.secondary">{`${t("typologyDetails.bedrooms")}: ${
              									typology.bedroomNumber
              								}`}</StyledTypography>
              							</Stack>
              						</Grid>
              						<Grid item>
              							<Stack direction="row" gap={1}>
              								<Bathtub color="primary" />
              								<StyledTypography variant="body2" color="text.secondary">{`${t("typologyDetails.bathrooms")}: ${
              									typology.bathroomNumber
              								}`}</StyledTypography>
              							</Stack>
              						</Grid>
              						<Grid item>
              							<Stack direction="row" gap={1}>
              								<Garage color="primary" />
              								<StyledTypography variant="body2" color="text.secondary">{`${t("typologyDetails.garage")}: ${
              									typology.garageNumber
              								}`}</StyledTypography>
              							</Stack>
              						</Grid>
									  <Grid item>
              							<Stack direction="row" gap={1}>
              								<Euro color="primary" />
              								<StyledTypography variant="body2" color="text.secondary">{`${t("typologyDetails.price")}: ${
              									typology.price
              								}`}</StyledTypography>
              							</Stack>
              						</Grid>
									  {/* <Grid item>
              							<Stack direction="row" gap={1}>
              								<Dashboard color="primary" />
              								<StyledTypography variant="body2" color="text.secondary">{`Plant: ${
              									typology.plant
              								}`}</StyledTypography>
              							</Stack>
              						</Grid> */}
              					</Grid>
              				</AccordionDetails>
              			</Accordion>
              	);
              })}
					</TabPanel>
					<TabPanel index={1} value={value}>
						<Box>
							<Typography>
                Id labore officia amet consectetur aliqua culpa incididunt cillum non duis pariatur.
                Labore pariatur cillum sit ad reprehenderit eiusmod esse consequat ullamco ullamco.
                Commodo voluptate veniam veniam nulla non aute culpa ea irure amet sint
                exercitation. Ipsum labore magna sint incididunt sint adipisicing esse nisi minim
                non deserunt. Nulla eiusmod magna et enim dolor ullamco mollit ea aute ex magna non.
                Do sit ut adipisicing do minim quis labore id ea tempor sint est. Ad qui cillum amet
                anim ad.
								<br />
                In est quis minim esse eu aliquip nostrud labore sunt adipisicing adipisicing.
                Pariatur aute ad deserunt ut consequat laboris ut voluptate laboris fugiat sint. Eu
                aute ex ipsum occaecat consectetur reprehenderit cupidatat sunt. Dolore nisi ullamco
                cillum mollit cillum Lorem. Cillum quis magna veniam officia voluptate Lorem nisi
                culpa sit consequat excepteur cupidatat. Labore anim eu tempor quis duis fugiat
                ullamco ipsum adipisicing consequat excepteur. Fugiat mollit aute nulla veniam
                cillum qui occaecat deserunt pariatur id laborum cillum adipisicing culpa.
							</Typography>
							<Grid container justifyContent={"flex-end"} paddingTop={4}>
								<Grid item sm={2}>
									<StyledButton
										variant="contained"
										color="primary"
										onClick={() => setShowEnrollmentModal(true)}>
                    Pre-Enroll
									</StyledButton>
									<EnrollmentModal
										open={showEnrollmentModal}
										handleEnrollmentModalClose={handleEnrollmentModalClose}
										project={project}
									/>
								</Grid>
							</Grid>
						</Box>
					</TabPanel>
					<TabPanel index={2} value={value}>
						<UpdateStepper updates={data.project.updates} />
					</TabPanel>
				</Grid>
			</Paper>
			<Paper sx={{ mt: 4, border: "1px solid rgb(237, 237, 237)", boxShadow: 0 }}>
				<div id="map" style={{ height: 480 }}>
					<Map centerCoordinates={project.coordinates as LatLngTuple} markers={[project.coordinates] as LatLngTuple[]} />
				</div>
			</Paper>
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (context: any) => {
	const id = context.params.projectId;
	const projectRes = await fetch(`${process.env.API_URL}/project/${id}`);
	const project = (await projectRes.json()) as Project;

	return {
		props: {
			project,
			...(await serverSideTranslations(context.locale, [
				"common",
				"footer",
				"header",
				"projectpage"
			]))
		}
	};
};

export default ProjectDetails;
