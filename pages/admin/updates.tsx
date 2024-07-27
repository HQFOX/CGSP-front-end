import React, { Suspense, useState } from "react";
import type { NextPage } from "next";

import { Box, Divider, Grid, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { UpdateTable } from "../../components/updates/UpdateTable";
import { UpdateForm } from "../../components/forms/UpdateForm";
import { PageContainer } from "../../components/pageContainer/PageContainer";
import { Loading } from "../../components/loading/Loading";
import { StyledButton } from "../../components/Button";
import { useFetch } from "../../components/forms/utils";

const UpdateAdmin: NextPage<{ updates: Update[]; projects: Project[] }> = (data) => {
	const [updates, setUpdates] = useState<Update[]>(data.updates);
	const [editUpdate, setEditUpdate ] = useState<Update | undefined>();
	const [showAddUpdateForm, setShowAddUpdateForm] = useState(false);
	const [showEditUpdateForm, setShowEditUpdateForm] = useState(false);

	const refreshData = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update`);
		if (res.status == 200) {
			const updates = (await res.json()) as Update[];

			setUpdates(updates);
		}
	};

	const handleDelete = async (id: string | undefined) => {
		if (id) {
			const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/update/${id}`;

			await useFetch("DELETE", endpoint, undefined, true).then( (response) => {
				if(response.ok){
					refreshData();
				}
				else {
					throw new Error("Update Delete " + response.status);
				}
			}).catch( error => {
				console.log(error);
			});
		}
	};

	const handleShowEditForm = (update: Update) => { 
		setEditUpdate(update); 
		setShowEditUpdateForm(true); window.document.getElementById("editupdateform")?.scrollIntoView({behavior: "smooth", block: "start"});
	};

	const handleShowAddForm = () => {
		setShowAddUpdateForm(true);
		window.document.getElementById("addupdateform")?.scrollIntoView({behavior: "smooth", block: "start",});
	};

	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Atualizações
				</Typography>
				<Divider />
			</Box>
			{!showAddUpdateForm && (
				<Grid container mt={2} mb={2} >
					<Grid item>
						<StyledButton
							startIcon={<Add />}
							variant="contained"
							onClick={handleShowAddForm}>
							Criar Atualização
						</StyledButton>
					</Grid>
				</Grid>
			)}
			<UpdateTable updates={updates} handleShowEditForm={(update) => handleShowEditForm(update)} handleDelete={handleDelete} />
			<div id="addupdateform">
				{showAddUpdateForm && (
					<Suspense fallback={<Loading />}>
						<UpdateForm
							projects={data.projects}
							onCancel={() => setShowAddUpdateForm(false)}
							onSubmit={() => refreshData()}
						/>
					</Suspense>
				)}
			</div>
			<div id="editupdateform">
				{showEditUpdateForm && (
					<Suspense fallback={<Loading />}>
						<UpdateForm
							projects={data.projects}
							onCancel={() => setShowEditUpdateForm(false)}
							onSubmit={() => refreshData()}
							update={editUpdate}
						/>
					</Suspense>
				)}
			</div>
		</PageContainer>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
	
	const res = await fetch(`${process.env.API_URL}/update`);
	const updates = (await res.json()) as Update[];

	const projectRes = await fetch(`${process.env.API_URL}/project`);
	const projects = (await projectRes.json()) as Project[];

	return {
		props: {
			updates,
			projects,
			...(await serverSideTranslations(ctx.locale, ["common", "footer", "header"]))
		}
	};
};

export default UpdateAdmin;
