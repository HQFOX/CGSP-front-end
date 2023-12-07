import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageContainer } from "../components/pageContainer/PageContainer";
import { Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { ProjectInventory } from "../components/projects/projectInventory/ProjectInventory";
import { Title } from "../components/Title";

const History: NextPage<{ projects: Project[] }> = (data) => {
	
	useTranslation(["projectpage", "common"]);
	
	return (
		<PageContainer>
			<Box sx={{ p:2, pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{"Histórico de Projetos"}
				</Title>
				<Divider />
				<Typography variant="body2" color="text.secondary">
					<p>Esta cooperativa tem xxx anos de existência ininterrupta e deu início ao seu trabalhos com a promoção do primeiro programa que foram os primeiros 110 fogos do bairro da Malagueira, projeto do arquiteto Siza Vieira.</p>
					<p>A cooperativa começou inicialmente com o apoio da Câmara de Évora, que cedia terrenos e projeto, do INH ( atual IHRU) que dava apoio técnico e financeiro.</p>
					<p>Com a conclusão destes apoios e aproveitando o sucesso e confiança depositada pelos sócios a cooperativa continuou a sua missão de forma independente tendo resistido à crise imobiliária de pós 2008 e inclusive expandido as regiões de atuação.</p>
				</Typography>
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
