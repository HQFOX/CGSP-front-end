import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageContainer } from "../components/pageContainer/PageContainer";
import { Box, Divider, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { LoginForm } from "../components/forms/LoginForm";

const Login: NextPage = () => {
	
	useTranslation(["projectpage", "common"]);
	
	return (
		<PageContainer>
			<Box sx={{ p:2, pb: 4 }}>
				<Typography variant="h5" component="h1">
					{"Login"}
				</Typography>
				<Divider />
			</Box>
			<LoginForm />
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {

	return {
		props: {
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "projectpage"]))
		}
	};
};

export default Login;
