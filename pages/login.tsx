import React from "react";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageContainer } from "../components/pageContainer/PageContainer";
import { useTranslation } from "next-i18next";
import { LoginForm } from "../components/forms/LoginForm";

const Login: NextPage = () => {
	
	useTranslation(["projectpage", "common"]);
	
	return (
		<PageContainer>
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
