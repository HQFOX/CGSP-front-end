import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageContainer } from "../components/pageContainer/PageContainer";
import { Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { ProjectInventory } from "../components/projectInventory/ProjectInventory";

const History: NextPage<{ projects: Project[] }> = (data) => {
	
	useTranslation(["projectpage", "common"]);
	
	return (
		<PageContainer>
			<Box sx={{ p:2, pb: 4 }}>
				<Typography variant="h5" component="h1">
					{"Histórico de Projetos"}
				</Typography>
				<Divider />
			</Box>
			<ProjectInventory projects={data.projects} history/>
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(`${process.env.API_URL}/project`);
	const projects = (await res.json()) as Project[];

	return {
		props: {
			projects,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "projectpage"]))
		}
	};
};

export default History;
