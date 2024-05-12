import React from "react";

import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";

import styles from "../styles/Home.module.css";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styled from "@emotion/styled";

import CGSPCarousel from "../components/carousel/Carousel";
import logo from "../public/logo.svg";
import theme from "../theme";
import { Title } from "../components/Title";
import { Architecture, BookmarkAdd, Construction, Description, Group, MeetingRoom, OpenInNew, PersonAdd, Savings } from "@mui/icons-material";
import { StyledButton } from "../components/Button";
import Link from "next/link";
import { LatLngTuple } from "leaflet";

const Map = dynamic(() => import("../components/map/Map"), {
	ssr: false
},
);

const StyledMain = styled("main")({
	backgroundColor: "white",
});

const CGSPcenterCoordinates: LatLngTuple = [38.56633674453089, -7.925327404275489];



const Home: NextPage<{updates : Update[] }> = ( ) => {
	const { t } = useTranslation(["homepage", "common"]);

	return (
		<StyledMain className={styles.container && styles.main}>
			<CGSPCarousel />
			<Box sx={{backgroundColor: "rgb(249, 249, 249)", mt: 8, pb: 6}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4, textIndent: 35 }} id="aboutus">
						<Title variant="h4" component="h1" fontSize={24}>
							{t("whoAreWeTitle")}
						</Title>
						<Divider sx={{mb: 4}}/>
						<Typography variant="body2" color="text.secondary">
							{t("whoAreWeTextP1")}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t("whoAreWeTextP2")}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t("whoAreWeTextP3")}
						</Typography>
						<Typography variant="body2" color="text.secondary">						
							{t("whoAreWeTextP4")}
						</Typography>			
						<div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
							<Image src={logo} alt="Cooperativa Giraldo Sem Pavor logo" width={200} height={60} />
						</div>
					</Box>
				</Box>
			</Box>
			<Box sx={{backgroundColor: theme.palette.secondary.light, textIndent: 10 , pb: 8, pt: 8}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4 }} id="aboutus">
						<Title variant="h4" component="h1" fontSize={24}>
							{t("howDoesItWorkTitle")}
						</Title>
						<Divider />
					</Box>
					<Grid container columnSpacing={2}>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title >{t("projectElaborationTitle")}</Title>}  avatar={<Architecture color="success" />}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("projectElaborationText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<><Title>{t("inscriptionTitle")}</Title></>} avatar={<PersonAdd color="success"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("inscriptionText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>{t("reservationTitle")}</Title>} avatar={<BookmarkAdd color="success"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("reservationText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>{t("constructionTitle")}</Title>} avatar={<Construction color="success"/>} />
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("projectElaborationText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Box sx={{backgroundColor: "rgb(249, 249, 249)", textIndent: 10, pb: 8, pt: 8 }}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4 }} id="aboutus">
						<Title variant="h4" component="h1" fontSize={24}>
							{t("advantagesTitle")}
						</Title>
						<Divider />
					</Box>
					<Grid container columnSpacing={2}>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title >{t("controlledCostsTitle")}</Title>}  avatar={<Savings color="primary" />}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("controlledCostsText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>{t("transparencyTitle")}</Title>} avatar={<MeetingRoom color="primary"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("transparencyText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>{t("bureaucracyTitle")}</Title>} avatar={<Description color="primary"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("bureaucracyText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>{t("middlemanTitle")}</Title>} avatar={<Group color="primary"/>} />
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("middlemanText")}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Box sx={{ pt: 4, pb: 8}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pb: 4,
						pt: 4
					})}>
					<Title variant="h5" component="h1" fontSize={24}>
						{t("howToGetThere")}:
					</Title>
					<Divider />
					<Box id="map" style={{ height: 480}} sx={{pt: 2}}>
						<Map 
							zoom={13}
							centerCoordinates={CGSPcenterCoordinates} 
							markers={[ CGSPcenterCoordinates ]} 
							popupContent={
								<Link target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${CGSPcenterCoordinates[0]}%2C${CGSPcenterCoordinates[1]}`} passHref>
									<StyledButton endIcon={<OpenInNew />}>Ver No Google Maps</StyledButton>
								</Link>
							}
						/>
					</Box>
				</Box>
			</Box>
		</StyledMain>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
  
	const res = await fetch(`${process.env.API_URL}/update`);
	const updates = (await res.json()) as Update[];

	return { props: { 
		updates,
		...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "homepage"]))
	}};
};

export default Home;
