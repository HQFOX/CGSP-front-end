import React from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { UpdateTable } from "../../components/updates/UpdateTable";
import { UpdateForm } from "../../components/forms/UpdateForm";
import { Suspense, useState } from "react";
import { PageContainer } from "../../components/pageContainer/PageContainer";
import { Add } from "@mui/icons-material";
import { Loading } from "../../components/loading/Loading";
import { StyledButton } from "../../components/Button";

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
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update/${id}`, {
				method: "DELETE"
			});
	
			if (response.status == 200) {
				console.log("item eliminado");
				refreshData();
			} else {
				console.log(response);
			}
		}
	};

	const handleShowEditForm = (update: Update) => { 
		setEditUpdate(update); 
		setShowEditUpdateForm(true); window.document.getElementById("editupdateform")?.scrollIntoView({behavior: "smooth"});
	};

	return (
		<PageContainer>
			<Box sx={{ pb: 4 }}>
				<Typography variant="h5" component="h1">
					Administração de Atualizações
				</Typography>
				<Divider />
			</Box>
			<UpdateTable updates={updates} handleShowEditForm={(update) => handleShowEditForm(update)} handleDelete={handleDelete} />
			{!showAddUpdateForm && (
				<Grid container direction={"row-reverse"} mt={2}>
					<Grid item>
						<StyledButton
							startIcon={<Add />}
							variant="contained"
							onClick={() => setShowAddUpdateForm(true)}>
							Add Update
						</StyledButton>
					</Grid>
				</Grid>
			)}
			{showAddUpdateForm && (
				<Suspense fallback={<Loading />}>
					<UpdateForm
						projects={data.projects}
						onCancel={() => setShowAddUpdateForm(false)}
						onSubmit={() => refreshData()}
					/>
				</Suspense>
			)}
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
