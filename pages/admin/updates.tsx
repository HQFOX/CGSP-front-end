import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { UpdateTable } from "../../components/updates/UpdateTable";
import { AddUpdateForm } from "../../components/forms/AddUpdateForm";
import { Suspense, useState } from "react";
import { PageContainer } from "../../components/pageContainer/PageContainer";
import { Add } from "@mui/icons-material";
import { Loading } from "../../components/loading/Loading";

const UpdateAdmin: NextPage<{ updates: Update[]; projects: Project[] }> = (data) => {
	const [updates, setUpdates] = useState<Update[]>(data.updates);
	const [showAddUpdateForm, setShowAddUpdateForm] = useState(false);

	const handleSubmit = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update`);
		if (res.status == 200) {
			const updates = (await res.json()) as Project[];

			setUpdates(updates);
		}
	};

	return (
		<PageContainer>
			<Typography variant={"h4"} mb={2}>Update Table</Typography>
			<UpdateTable updates={updates} />
			{!showAddUpdateForm && (
				<Grid container direction={"row-reverse"} mt={2}>
					<Grid item>
						<Button
							startIcon={<Add />}
							variant="contained"
							onClick={() => setShowAddUpdateForm(true)}>
              Add Update
						</Button>
					</Grid>
				</Grid>
			)}
			{showAddUpdateForm && (
				<Suspense fallback={<Loading />}>
					<AddUpdateForm
						projects={data.projects}
						onCancel={() => setShowAddUpdateForm(false)}
						onSubmit={() => handleSubmit()}
					/>
				</Suspense>
			)}
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
