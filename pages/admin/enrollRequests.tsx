import React, { Suspense, useState } from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { EnrollRequestTable } from "../../components/enrollrequests/EnrollRequestTable";
import { PageContainer } from "../../components/pageContainer/PageContainer";
import { Add } from "@mui/icons-material";
import { StyledButton } from "../../components/Button";
import { useFetch } from "../../components/forms/utils";
import { Loading } from "../../components/loading/Loading";
import { EnrollRequestForm } from "../../components/forms/EnrollRequestForm";

const EnrollRequestsAdmin: NextPage<{ requests: EnrollRequest[], projects: Project[] }> = (data) => {
	const [requests, setRequests] = useState<EnrollRequest[]>(data.requests);
	const [editRequest, setEditRequest ] = useState<EnrollRequest | undefined>();
	const [showAddRequestForm, setShowAddRequestForm] = useState(false);
	const [showEditRequestForm, setShowEditRequestForm] = useState(false);

	const refreshData = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enroll`);
		if (res.status == 200) {
			const request = (await res.json()) as EnrollRequest[];

			setRequests(request);
		}
	};

	const handleDelete = async (id: string | undefined) => {
		if (id) {
			const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/enroll/${id}`;

			await useFetch("DELETE", endpoint, undefined, true).then( (response) => {
				if(response.ok){
					console.log(`EnrollRequest ${id} deleted`);
					refreshData();
				}
				else {
					throw new Error("EnrollRequest Delete " + response.status);
				}
			}).catch( error => {
				console.log(error);
			});
		}
	};

	const handleShowEnrollRequestForm = (request: EnrollRequest) => { 
		setEditRequest(request);
		setShowEditRequestForm(true); window.document.getElementById("editprojectform")?.scrollIntoView({behavior: "smooth"});
	};

	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Tabela de Pedidos de Inscrição
				</Typography>
				<Divider />
			</Box>
			{!showAddRequestForm && (
				<Grid container  mt={2} mb={2}>
					<Grid item>
						<StyledButton
							startIcon={<Add />}
							variant="contained"
							onClick={() => setShowAddRequestForm(true)}>
              				Adicionar Pedido de Inscrição
						</StyledButton>
					</Grid>
				</Grid>
			)}
			<EnrollRequestTable requests={requests} handleDelete={handleDelete} handleShowEditForm={handleShowEnrollRequestForm}/>
			{showAddRequestForm && (
				<Suspense fallback={<Loading />}>
					<EnrollRequestForm
						projects={data.projects}
						onCancel={() => setShowAddRequestForm(false)}
						onSubmit={() => refreshData()}
					/>
				</Suspense>
			)}
			<div id="editEnrollRequestForm">
				{showEditRequestForm && (
					<Suspense fallback={<Loading />}>
						<EnrollRequestForm
							request={editRequest}
							projects={data.projects}
							onCancel={() => setShowEditRequestForm(false)}
							onSubmit={() => refreshData()}						/>
					</Suspense>
				)}
			</div>
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	const res = await fetch(`${process.env.API_URL}/enroll`);
	const requests = (await res.json()) as EnrollRequest[];

	const projectRes = await fetch(`${process.env.API_URL}/project`);
	const projects = (await projectRes.json()) as Project[];

	console.log(projects);

	return {
		props: {
			requests,
			projects,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header"]))
		}
	};
};

export default EnrollRequestsAdmin;
