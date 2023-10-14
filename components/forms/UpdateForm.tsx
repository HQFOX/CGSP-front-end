import React from "react";
import { CheckCircle, Close } from "@mui/icons-material";
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
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { CancelModal } from "../modals/CancelModal";
import { CGSPDropzone } from "../dropzone/Dropzone";
import { StyledButton } from "../Button";

export interface PresignedFile {
	filename: string,
	link?: string,
	file?: File,
}

const getFileExtension = (filename: string) => {
	return filename.substring(filename.lastIndexOf("."), filename.length) || filename;
};


const submitFile = async (file : PresignedFile) => {
	if(file.file){

		const endpoint = file.link ?? "";

		const options = {
			method: "PUT",
			headers: {
				"Content-Type": file.file?.type
			},
			body: file.file
		};

		const response = await fetch(endpoint, options);

		console.log(response);
		if (response.status !== 200) {
			const result = (await response.json());
			console.log(result);
			return response.url;
		}
		return null;
	}

};

const getPresignedUrl = async (file: File) => {

	const values = {
		filename: file.name,
		extension: getFileExtension(file.name),
	};

	const jsonData = JSON.stringify(values);

	const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/file/url`;

	// console.log(jsonData);

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: jsonData
	};

	const response = await fetch(endpoint, options);

	if (response.status == 200) {
		const result = (await response.json()) as PresignedFile;
		result.file = file;
		console.log(result);
		return result;
	}
	return null;
};


export const UpdateForm = ({ projects, onCancel, onSubmit, update }: { projects?: Project[], onCancel: () => void, onSubmit: () => void, update?: Update }) => {
	const [file, setFile] = useState<PresignedFile[]>([]);
	const [cancelModal, setCancelModal] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const handleAddFile = async (files: File[]) => {
		const newfile = await getPresignedUrl(files[0]);
		if(newfile)
			setFile([...file, newfile]);
	};

	const handleDeleteFile = () => {
		setFile([]);
	};

	const formik = useFormik({
		initialValues: {
			id: update ? update.id : "0",
			title: update ? update.title : "teste",
			content: update ? update.content : "teste",
			projectId: ""
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Obrigatório"),
			content: Yup.string(),
			projectId: Yup.string()
		}),
		onSubmit: async (values) => {

			const imageUrl = submitFile(file[0]);

			if(imageUrl != null){

				const jsonData = JSON.stringify(values);

				const endpoint = update ? `${process.env.NEXT_PUBLIC_API_URL}/update/${update.id}` : `${process.env.NEXT_PUBLIC_API_URL}/update`;
	
				console.log(console.log(jsonData));
	
				const options = {
					method: update ? "PUT" : "POST",
					headers: {
						"Content-Type": "application/json"
					},
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
									multiline
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="projectId"
									name="projectId"
									label={"Projeto Relacionado: "}
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
							<Grid item xs={6}>
								<Typography variant="h6">Adicionar Foto à Atualização</Typography>
								<CGSPDropzone
									maxContent={1}
									files={file}
									onAddFile={handleAddFile}
									onDeleteFile={handleDeleteFile}
								/>
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
