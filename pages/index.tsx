import React, { useState, ReactElement } from "react";

import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

import { Avatar, Box, CardContent, CardHeader, Divider, Grid, styled, Typography } from "@mui/material";

import styles from "../styles/Home.module.css";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import CGSPCarousel from "../components/carousel/Carousel";
import logo from "../public/logo.svg";
import theme from "../theme";
import { Title } from "../components/Title";
import { Architecture, BookmarkAdd, Construction, Description, Group, MeetingRoom, OpenInNew, PersonAdd, Savings } from "@mui/icons-material";
import { StyledButton } from "../components/Button";
import Link from "next/link";
import { LatLngTuple } from "leaflet";
import { StyledCard } from "../components/StyledCard";

const Map = dynamic(() => import("../components/map/Map"), {
	ssr: false
},
);

const StyledMain = styled("main")({
	backgroundColor: "white",
});




const CGSPcenterCoordinates: LatLngTuple = [38.56633674453089, -7.925327404275489];

const HoverCard = ({title, color, icon, children}: {title: ReactElement, color: string, icon: ReactElement, children: ReactElement}) => {
	const [hovered, setHovered] = useState(false);

	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);

	return (
		<StyledCard
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			variant="outlined"
		>
			<CardHeader title={<Title component={"span"}>{title}</Title>}  
				avatar={<Avatar sx={{color: hovered ? "white" : color, bgcolor: hovered ? color : "white", transition: "0.3s", boxShadow: "0 5px 8px 0 rgba(0,0,0,.09)",}}>{icon}</Avatar>}/>
			{children}
		</StyledCard>
	);
};



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
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard  title={<Title >{t("projectElaborationTitle")}</Title>} icon={<Architecture color="inherit" fontSize="large"/>} color={theme.palette.success.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("projectElaborationText")}
									</Typography>
								</CardContent>
							</HoverCard>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title>{t("inscriptionTitle")}</Title>} icon={<PersonAdd color="inherit" fontSize="large"/>} color={theme.palette.success.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("inscriptionText")}
									</Typography>
								</CardContent>
							</HoverCard>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title>{t("reservationTitle")}</Title>} icon={<BookmarkAdd color="inherit" fontSize="large"/>} color={theme.palette.success.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("reservationText")}
									</Typography>
								</CardContent>
							</HoverCard>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title>{t("reservationTitle")}</Title>} icon={<Construction color="inherit" fontSize="large"/>} color={theme.palette.success.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("projectElaborationText")}
									</Typography>
								</CardContent>
							</HoverCard>
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
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title >{t("controlledCostsTitle")}</Title>} icon={<Savings color="inherit" fontSize="large"/>} color={theme.palette.primary.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("controlledCostsText")}
									</Typography>
								</CardContent>
							</HoverCard>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title>{t("transparencyTitle")}</Title>} icon={<MeetingRoom color="inherit" fontSize="large"/>} color={theme.palette.primary.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("transparencyText")}
									</Typography>
								</CardContent>
							</HoverCard>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title>{t("bureaucracyTitle")}</Title>} icon={<Description color="inherit" fontSize="large"/>} color={theme.palette.primary.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("bureaucracyText")}
									</Typography>
								</CardContent>
							</HoverCard>
						</Grid>
						<Grid item xs={12} sm={6} md={3}>
							<HoverCard title={<Title>{t("middlemanTitle")}</Title>} icon={<Group color="inherit" fontSize="large"/>} color={theme.palette.primary.main}>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										{t("middlemanText")}
									</Typography>
								</CardContent>
							</HoverCard>
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

	const res = fetch(`${process.env.API_URL}/update`)
		.then( res => res.ok ? res.json().then( data => data) : console.log(res.statusText));
  

	const updates = res ? await res as Update[] : [];
	return { props: { 
		updates: updates,
		...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "homepage"]))
	}};
};

export default Home;
