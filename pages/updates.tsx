import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageContainer } from "../components/pageContainer/PageContainer";
import { Box, Divider } from "@mui/material";
import Updates from "../components/updates/Update";
import { useTranslation } from "react-i18next";
import { Title } from "../components/Title";

const UpdatePage: NextPage<{ updates: Update[]}> = (data) => {

	const { t } = useTranslation(["common"]);

	return (
		<PageContainer>
			<Box sx={{ p:2, pb: 4 }}>
				<Title variant="h5" component="h1" fontSize={24}>
					{t("updates")}
				</Title>
				<Divider />
			</Box>
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
