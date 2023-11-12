import React, { useState } from "react";

import {
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

import { CheckCircle, Close } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";

import { CancelModal } from "../modals/CancelModal";
import { CGSPDropzone } from "../dropzone/Dropzone";
import { StyledButton } from "../Button";
import { AbstractFile } from "./types";
import { getPresignedUrl, submitFile } from "./utils";

export const UpdateForm = ({
	 projects, 
	 onCancel, 
	 onSubmit, 
	 update
	 }	: { projects?: Project[], onCancel: () => void, onSubmit: () => void, update?: Update }) => {

	const [files, setFiles] = useState<AbstractFile[]>(update?.files ?? []);

	const [cancelModal, setCancelModal] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const handleAddFile = async (newfiles: File[]) => {
		newfiles.map( file =>  getPresignedUrl(file).then( value => value && setFiles([...files, value])));
	};

	const handleDeleteFile = () => {
		setFiles([]);
	};

	const formik = useFormik({
		initialValues: {
			id: update ? update.id : "0",
			title: update?.title ? update.title : "teste",
			content: update?.content ? update.content : "teste",
			project: update?.project ? update.project : null,
			
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Obrigatório"),
			content: Yup.string(),
		}),
		onSubmit: async (values) => {

			// if(files.length > 0){

			Promise.all(files.map( async (file) => submitFile(file)))
				.then( async res => {
					console.log(res);
					
					const valuesWithImage = {...values, files: files.map( file => { return { "filename": file.filename};})};

					postUpdate(valuesWithImage);
				})
				.catch( error => console.log(error));
				
			// }
			// else{
			// 	postUpdate(values);
			// }

		}
	});

	const handleClose = (confirm: boolean) => {
		setCancelModal(false);
		confirm && onCancel();
	};

	const postUpdate = (values: unknown) => {

		const jsonData = JSON.stringify(values);

		const endpoint = update ? `${process.env.NEXT_PUBLIC_API_URL}/update/${update.id}` : `${process.env.NEXT_PUBLIC_API_URL}/update`;

		const options = {
			method: update ? "PUT" : "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: jsonData
		};

		fetch(endpoint, options).then( () => {
			setSubmitted(true);
			onSubmit();

		}).catch( error => {
			console.log(error);
		});


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
								<Typography variant="h6">Adicionar Foto à Atualização</Typography>
								<CGSPDropzone
									maxContent={1}
									files={files}
									onAddFile={handleAddFile}
									onDeleteFile={handleDeleteFile}
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
									multiline
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="projectId"
									name="project.projectId"
									label={"Projeto Relacionado: "}
									select
									value={formik.values.project?.projectId}
									onChange={formik.handleChange}
									// error={formik.touched.project?.projectId && Boolean(formik.errors.project?.projectId)}
									// helperText={formik.touched.project?.projectId && formik.errors.project?.projectId}
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
								<StyledButton type="submit" variant="contained" color="primary" value="submit" fullWidth>
									{"Submit"}
								</StyledButton>
							</Grid>
							<Grid item>
								<StyledButton variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
                 					 Cancel
								</StyledButton>
							</Grid>
						</Grid>
					</form>
				)}
			</Container>
			<CancelModal open={cancelModal} handleClose={(confirm) => handleClose(confirm)}/>
		</Paper>
	);
};
