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
import { getPresignedUrl , submitFile, useFetch } from "./utils";
import { Loading } from "../loading/Loading";

export const UpdateForm = ({
	 projects, 
	 onCancel, 
	 onSubmit, 
	 update
	 }	: { projects?: Project[], onCancel: () => void, onSubmit: () => void, update?: Update }) => {

	const [files, setFiles] = useState<AbstractFile[]>(update?.files ?? []);

	const [cancelModal, setCancelModal] = useState(false);

	const [submitting, setSubmitting] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState<string | undefined>(undefined);

	const handleAddFile = async (newfiles: File[]) => {
		newfiles.map( file =>  getPresignedUrl(file).then( value => value && setFiles([...files, value])));
	};

	const handleDeleteFile = () => {
		setFiles([]);
	};

	const formik = useFormik({
		initialValues: {
			id: update?.id ?? "0",
			title: update?.title ?? "teste",
			content: update?.content ?? "",
			project: update?.project ? update.project : null,
			
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Obrigatório"),
			content: Yup.string(),
		}),
		onSubmit: async (values) => {

			Promise.all(files.map( async (file) => submitFile(file)))
				.then( async res => {
					console.log(res);
					
					const valuesWithImage = {...values, files: files.map( file => { return { "filename": file.filename};})};

					postUpdate(valuesWithImage);
				})
				.catch( error => console.log(error));
				
		}
	});

	const handleClose = (confirm: boolean) => {
		setCancelModal(false);
		confirm && onCancel();
	};

	const postUpdate = async (values: unknown) => {

		const endpoint = update ? `${process.env.NEXT_PUBLIC_API_URL}/update/${update.id}` : `${process.env.NEXT_PUBLIC_API_URL}/update`;

		const res = await useFetch("POST", endpoint,values).then( (response) => {
			if(response.ok){
				setSuccess(true);
				onSubmit();
				return response.json();
			}
			else {
				throw new Error("Update Post " + response.status);
			}
		}).catch( error => {
			setSuccess(false);
			setError("Erro a submeter Atualização");
			console.log(error);
		});

		setSubmitting(false);

		if(res)
			return res as Update;
		return undefined;


	};

	return (
		<Paper sx={{ mt: 4 , minHeight: 600}}>
			<Container>
				<Grid container pt={2}>
					<Grid item mt={4}>
						<Typography variant={"h5"}>{ update ? "Editar Update": "Adicionar Update"}</Typography>
					</Grid>
					<Grid item ml="auto">
						<IconButton onClick={() => {success ? onCancel() : setCancelModal(true);}}>
							<Close />
						</IconButton>
					</Grid>
				</Grid>
				{success ? (
					<Grow in={true}>
						<Stack alignContent={"center"} pt={6} sx={{ textAlign: "center" }}>
							<CheckCircle color={"success"} style={{ fontSize: "120px", margin: "auto" }} />
							<Typography variant="h5">{ update ? "Atualização Editada": "Nova Atualização Adicionada"}</Typography>
							<Typography variant="subtitle1" color="text.secondary">Confirme na tabela de atualizações ou na página pública de atualizações</Typography>
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
								{submitting ? <Loading /> : success ?  <CheckCircle color={"success"} style={{ fontSize: "50px" }} />: <Typography color={"error"}>{error}</Typography>}
							</Grid>
							<Grid item >
								<StyledButton type="submit" variant="contained" color="primary" value="submit" fullWidth>
									{"Submeter"}
								</StyledButton>
							</Grid>
							<Grid item>
								<StyledButton variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
                 					 Cancelar
								</StyledButton>
							</Grid>
						</Grid>
					</form>
				)}
			</Container>
			<CancelModal open={cancelModal} handleClose={(confirm) => handleClose(confirm)}  title="Cancelar Criação de Update"/>
		</Paper>
	);
};
