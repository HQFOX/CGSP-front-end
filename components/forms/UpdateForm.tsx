import React from "react";
import { CheckCircle, Close } from "@mui/icons-material";
import {
	Button,
	Container,
	Grid,
	Grow,
	IconButton,
	MenuItem,
	Paper,
	Stack,
	TextField,
	Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { CancelModal } from "../modals/CancelModal";

export const UpdateForm = ({ projects, onCancel, onSubmit, update }: { projects?: Project[], onCancel: () => void, onSubmit: () => void, update?: Update }) => {
	const [cancelModal, setCancelModal] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const formik = useFormik({
		initialValues: {
			id: update ? update.id : "0",
			title: update ? update.title : "",
			content: update ? update.content : "",
			projectId: ""
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Obrigatório"),
			content: Yup.string(),
			projectId: Yup.string()
		}),
		onSubmit: async (values) => {
			const jsonData = JSON.stringify(values);

			const endpoint = update ? `${process.env.NEXT_PUBLIC_API_URL}/update/${update.id}` : `${process.env.NEXT_PUBLIC_API_URL}/update`;

			console.log(console.log(jsonData));

			const options = {
				// The method is POST because we are sending data.
				method: update ? "PUT" : "POST",
				// Tell the server we're sending JSON.
				headers: {
					"Content-Type": "application/json"
				},
				// Body of the request is the JSON data we created above.
				body: jsonData
			};

			const response = await fetch(endpoint, options);

			if (response.status == 200) {
				setSubmitted(true);
				onSubmit();
			}
			const result = response.json();
			console.log(result);
		}
	});

	const handleClose = (confirm: boolean) => {
		setCancelModal(false);
		confirm && onCancel();
	};

	return (
		<Paper sx={{ mt: 4 }}>
			<Container>
				<Grid container pt={2}>
					<Grid item mt={4}>
						<Typography variant={"h5"}>{ update ? "Editar Update": "Adicionar Update"}</Typography>
					</Grid>
					<Grid item ml="auto">
						<IconButton onClick={() => {submitted ? onCancel() : setCancelModal(true);}}>
							<Close />
						</IconButton>
					</Grid>
				</Grid>
				{submitted ? (
					<Grow in={true}>
						<Stack alignContent={"center"} pt={6} sx={{ textAlign: "center" }}>
							<CheckCircle color={"success"} style={{ fontSize: "120px", margin: "auto" }} />
							<Typography variant="h5">Novo Update Adicionado</Typography>
							<Typography variant="subtitle1"></Typography>
						</Stack>
					</Grow>
				) : (
					<form onSubmit={formik.handleSubmit}>
						<Grid container rowSpacing={4} pb={2} pt={4} columnSpacing={4}>
							<Grid item xs={12}>
								<TextField
									id="title"
									name="title"
									label={"title"}
									value={formik.values.title}
									onChange={formik.handleChange}
									error={formik.touched.title && Boolean(formik.errors.title)}
									helperText={formik.touched.title && formik.errors.title}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="content"
									name="content"
									label={"content"}
									value={formik.values.content}
									onChange={formik.handleChange}
									error={formik.touched.content && Boolean(formik.errors.content)}
									helperText={formik.touched.content && formik.errors.content}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="projectId"
									name="projectId"
									label={"projectId"}
									select
									value={formik.values.projectId}
									onChange={formik.handleChange}
									error={formik.touched.projectId && Boolean(formik.errors.projectId)}
									helperText={formik.touched.projectId && formik.errors.projectId}
									fullWidth>
									{projects &&
                  projects.length > 0 &&
                  projects.map((option) => (
                  	<MenuItem key={option.id} value={option.id}>
                  		{option.title}
                  	</MenuItem>
                  ))}
								</TextField>
							</Grid>
							<Grid item ml="auto">
								<Button type="submit" variant="contained" color="primary" value="submit" fullWidth>
									{"Submit"}
								</Button>
							</Grid>
							<Grid item>
								<Button variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
                  Cancel
								</Button>
							</Grid>
						</Grid>
					</form>
				)}
			</Container>
			<CancelModal open={cancelModal} handleClose={(confirm) => handleClose(confirm)}/>
		</Paper>
	);
};
