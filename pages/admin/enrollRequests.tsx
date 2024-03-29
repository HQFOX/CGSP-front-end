import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EnrollRequestTable } from "../../components/enrollrequests/EnrollRequestTable";
import { PageContainer } from "../../components/pageContainer/PageContainer";

const EnrollRequestsAdmin: NextPage<{ requests: EnrollRequest[] }> = (data) => {
	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Enroll Requests Table
				</Typography>
				<Divider />
			</Box>
			<EnrollRequestTable requests={data.requests} />
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(`${process.env.API_URL}/enroll`);
	const requests = (await res.json()) as EnrollRequest[];

	return {
		props: {
			requests,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header"]))
		}
	};
};

export default EnrollRequestsAdmin;
