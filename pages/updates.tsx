import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageContainer } from "../components/pageContainer/PageContainer";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import Updates from "../components/updates/Update";

const UpdatePage: NextPage<{ updates: Update[]}> = (data) => {

	return (
		<PageContainer>
			<Box sx={{ p:2, pb: 4 }}>
				<Typography variant="h5" component="h1">
					{"Atualizações"}
				</Typography>
				<Divider />
			</Box>
			<Paper sx={{ ml: 1, mr: 1, p: 2, mb: 2 }}>
				<Grid container spacing={2}>
					<Grid item>

					</Grid>
				</Grid>
			</Paper>
			<Box sx={{display: "flex", justifyContent: "center"}}>
				<Updates updates={data.updates}/>
			</Box>
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(`${process.env.API_URL}/update`);
	const updates = (await res.json()) as Update[];

	return {
		props: {
			updates,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "homepage"]))
		}
	};
};


export default UpdatePage;
