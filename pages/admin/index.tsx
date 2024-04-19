import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BasicChart } from "../../components/charts/BasicChart";
import { PageContainer } from "../../components/pageContainer/PageContainer";

const DashBoard: NextPage = () => {
	return (
		<PageContainer>
			{/* <BasicChart /> */}
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	//   const res = await fetch(`http://localhost:8080/project`);
	//   const projects = (await res.json()) as Project[];

	return {
		props: {
			//   projects,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header"]))
		}
	};
};

export default DashBoard;
