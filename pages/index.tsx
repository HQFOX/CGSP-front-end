import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CGSPCarousel from "../components/carousel/Carousel";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../public/logo.svg";
import Updates from "../components/updates/Update";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";
import theme from "../theme";

const Map = dynamic(() => import("../components/map/Map"), {
	ssr: false
},
);

const StyledMain = styled("main")({
	backgroundColor: theme.palette.secondary.main
});




const Home: NextPage<{updates : Update[] }> = ( data ) => {
	const { t } = useTranslation(["homepage", "common"]);

	return (
		<StyledMain className={styles.container && styles.main}>
			<CGSPCarousel />
			<Box sx={{backgroundColor: theme.bg.main, mt: 8}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4 }}>
						<Typography variant="h4" component="h1" style={{ textAlign: "center" }}>
							{t("aboutUsTitle")}
						</Typography>
						<Divider />
					</Box>
					<Typography variant="h6" component="h2" style={{ whiteSpace: "pre-wrap" }}>
						{t("aboutUsText")}
					</Typography>
				</Box>
			</Box>
			<Box sx={{backgroundColor: theme.bg.main, mt: 20, pt: 4, pb: 8}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pb: 4,
						pt: 4
					})}>
					<Typography variant="h5" component="h1">
						{t("howToGetThere")}:
					</Typography>
					<Divider />
					<Box id="map" style={{ height: 480}} sx={{pt: 2}}>
						<Map centerCoordinates={[38.56633674453089, -7.925327404275489]} markers={[ [38.56633674453089, -7.925327404275489] ]}/>
					</Box>
				</Box>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Image src={logo} alt="logo" width={200} height={60} />
				</div>
			</Box>
			<Box sx={{backgroundColor: theme.bg.main, mt: 20, display: "flex", justifyContent: "center"}}>
				<Updates updates={data.updates}/>
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
