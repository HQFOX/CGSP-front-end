/* eslint-disable @typescript-eslint/no-explicit-any */
import React , { KeyboardEvent, useRef, useState } from "react";

import {
	Chip,
	Grid,
	MenuItem,
	Select,
	Autocomplete,
	TextField,
	Typography,
	AccordionDetails,
	Accordion,
	AccordionSummary,
	Paper,
	Container,
	Grow,
	Stack,
	IconButton,
	Box,
	InputLabel,
	FormControl,
} from "@mui/material";
import { CheckCircle, Close, ExpandMore } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";

import dynamic from "next/dynamic";

import { CGSPDropzone } from "../dropzone/Dropzone";
import { CancelModal } from "../modals/CancelModal";
import { StyledButton } from "../Button";
import { getPresignedUrl, submitFile } from "./utils";
import { AbstractFile } from "./types";
import { useTranslation } from "react-i18next";

const Map = dynamic(() => import("../map/Map"), {
	ssr: false
},
);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const submitImage = (file: File): boolean => {
	return true;
};

export const uploadImages = (path: string, files: File[]): boolean => {
	// Todo: this is a simulation and should be replaced

	files.map((file) => {
		if(!submitImage(file))
			return false;
	});
	return true;
};

export const ProjectForm = ({ project, onCancel, onSubmit }: { project?: Project, onCancel: () => void, onSubmit: () => void}) => {

	const { t } = useTranslation(["projectpage", "common"]);

	const [files, setFiles] = useState<AbstractFile[]>(project?.files ?? []);
	const [coverPhoto, setCoverPhoto] = useState<AbstractFile[]>([]);
	const [cancelModal, setCancelModal] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	const ref = useRef(null);

	const formik = useFormik({
		initialValues: {
			title: project?.title ?? "Projeto",
			assignmentStatus: "WAITING" ?? "",
			constructionStatus: "ALLOTMENTPERMIT" ?? "",
			location: project?.location ?? "Évora",
			lots: project ? project.lots :"10",
			assignedLots: project ? project.assignedLots :"0",
			typology: [] as { index: ""; typology: "" }[],
			typologies: [] as { bedroomNumber: ""; bathroomNumber: "" }[],
			latitude: project?.coordinates ? project.coordinates[0] : 38.56633674453089,
			longitude: project?.coordinates ? project.coordinates[1] : -7.925327404275489,
			files: [] as { filename: string }[]
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Obrigatório"),
			location: Yup.string().required("Obrigatório"),
			lots: Yup.string().required("Obrigatório"),
			assignedLots: Yup.string(),
			typology: Yup.array().of(
				Yup.object().shape({
					index: Yup.string(),
					typology: Yup.string(),
				})
			),
			typologies: Yup.array().of(
				Yup.object().shape({
					// bedroomNumber: Yup.string().required("Obrigatório"),
					// bathroomNumber: Yup.string().required("Obrigatório")
				})
			),
			latitude: Yup.number().required("Obrigatório"),
			longitude: Yup.number().required("Obrigatório")
		}),
		onSubmit: async (values) => {

			Promise.all(coverPhoto.map( async (file) => submitFile(file))).then( async () => {
				
				Promise.all(files.map( async (file) => submitFile(file)))
					.then( async res => {
						console.log(res);

						const formatValue = {
							title: values.title,
							assignmentStatus: values.assignmentStatus,
							constructionStatus: values.constructionStatus,
							location: values.location,
							lots: values.lots,
							assignedLots: values.assignedLots,
							typologies: values.typologies,
							coordinates: [values.latitude, values.longitude],
							coverPhoto: coverPhoto.map( cover => { return { "filename": cover.filename };})[0],
							files: files.map( file => { return { "filename": file.filename};})
						};
		
						postProject(formatValue);
					})
					.catch( error => console.log(error));
			});

		}
	});

	const handleTypologyDelete = (index: string | undefined) => {
		formik.setValues({
			...formik.values,
			typology: formik.values.typology.filter((value) => value.index != index)
		});
	};

	const handleTypologyAdd = (option: string) => {
		const newTypology = { index: formik.values.typology.length.toString(), typology: option };
		formik.setValues({
			...formik.values,
			typology: formik.values.typology.concat(newTypology as { index: ""; typology: "" }),
			typologies: formik.values.typologies.concat({ bedroomNumber: "", bathroomNumber: "" })
		});
	};

	const handleKeyDown = (e: KeyboardEvent<any>) => {
		e.key === "Enter" ? handleTypologyAdd(e.target.value) : undefined;
	};

	const handleAddFile = async (newfiles: File[]) => {
		newfiles.map( file =>  getPresignedUrl(file).then( value => value && setFiles([...files, value])));
	};

	const handleDeleteFile = (file: AbstractFile) => {
		setFiles(files.filter( item => item != file));
	};

	const handleAddCover = async (newfiles: File[]) => {
		newfiles.map( file =>  getPresignedUrl(file).then( value => value && setCoverPhoto([...files, value])));
	};

	const handleDeleteCover = () => {
		setCoverPhoto([]);
	};

	const handleClose = (confirm: boolean) => {
		setCancelModal(false);
		confirm && onCancel();
	};

	const postProject = (values: unknown) => {
		const jsonData = JSON.stringify(values);

		console.log(jsonData);

		const endpoint = project ? `${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}` : `${process.env.NEXT_PUBLIC_API_URL}/project` ;

		const options = {
			method: project ? "PUT" : "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: jsonData
		};

		fetch(endpoint, options).then( (response) => {
			if(response.ok){
				setSubmitted(true);
				onSubmit();
			}
			throw new Error("Error submitting Project:" + response);

		}).catch( error => {
			console.log(error);
		});
	};

	return (
		<Paper sx={{ mt: 4 }}>
			<Container>
				<Grid container pt={2}>
					<Grid item mt={4}>
						<Typography variant={"h5"}>{ project ? "Editar Projeto": "Adicionar Projeto"}</Typography>
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
							<Typography variant="h5">Novo Projeto Adicionado</Typography>
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
									label={"Nome do projeto"}
									value={formik.values.title}
									onChange={formik.handleChange}
									error={formik.touched.title && Boolean(formik.errors.title)}
									helperText={formik.touched.title && formik.errors.title}
									fullWidth
								/>
							</Grid>
							<Grid item xs={4}>
								<FormControl sx={{ width: "100%"}}>
									<InputLabel id="assignment-status-select-dropdown-label">Assignment Status</InputLabel>
									<Select
										label="Assignment Status"
										labelId="assignment-status-select-dropdown-label"
										id="assignment-status-select-dropdown"
										name="assignmentStatus"
										value={formik.values.assignmentStatus}
										error={formik.touched.assignmentStatus && Boolean(formik.errors.assignmentStatus)}
										onChange={formik.handleChange}
										sx={{ width: "100%" }}>
										<MenuItem value={"WAITING"}>{t("assignmentStatus.WAITING")}</MenuItem>
										<MenuItem value={"ONGOING"}>{t("assignmentStatus.ONGOING")}</MenuItem>
										<MenuItem value={"CONCLUDED"}>{t("assignmentStatus.CONCLUDED")}</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={4}>
								<FormControl sx={{ width: "100%"}}>
									<InputLabel id="construction-status-select-dropdown-label">Construction Status</InputLabel>
									<Select
										label="Construction Status"
										labelId="construction-status-select-dropdown-label"
										id="construction-status-select-dropdown"
										name="constructionStatus"
										value={formik.values.constructionStatus}
										error={formik.touched.constructionStatus && Boolean(formik.errors.constructionStatus)}
										onChange={formik.handleChange}
										sx={{ width: "100%" }}>
										<MenuItem value={"ALLOTMENTPERMIT"}>{t("constructionStatus.ALLOTMENTPERMIT")}</MenuItem>
										<MenuItem value={"BUILDINGPERMIT"}>{t("constructionStatus.BUILDINGPERMIT")}</MenuItem>
										<MenuItem value={"CONCLUDED"}>{t("constructionStatus.CONCLUDED")}</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="lots"
									name="lots"
									label={"Lots"}
									value={formik.values.lots}
									onChange={formik.handleChange}
									error={formik.touched.lots && Boolean(formik.errors.lots)}
									helperText={formik.touched.lots && formik.errors.lots}
									fullWidth
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="assignedLots"
									name="assignedLots"
									label={"Assigned Lots"}
									value={formik.values.assignedLots}
									onChange={formik.handleChange}
									error={formik.touched.assignedLots && Boolean(formik.errors.assignedLots)}
									helperText={formik.touched.assignedLots && formik.errors.assignedLots}
									fullWidth
								/>
							</Grid>
							<Grid item xs={12}>
								<Autocomplete
									multiple
									options={[]}
									freeSolo
									value={formik.values.typology.map((element) => element.typology)}
									renderTags={(value, getTagProps) =>
										value.map((option, index) => (
											// eslint-disable-next-line react/jsx-key
											<Chip
												variant="outlined"
												label={option}
												{...getTagProps({ index })}
												onDelete={() =>
													handleTypologyDelete(formik.values.typology.at(index)?.index)
												}
											/>
										))
									}
									renderInput={(params) => (
										<TextField
											ref={ref}
											{...params}
											label={"typology"}
											onKeyDown={(e) => handleKeyDown(e)}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={12}>
								{formik.values.typology.map((typology, index) => {
									return (
										<Accordion key={"typologyDetails" + index} defaultExpanded={index == 0}>
											<AccordionSummary
												expandIcon={<ExpandMore />}
												aria-controls="panel1a-content"
												id="panel1a-header">
												<Typography>{typology.typology}</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<Grid container rowSpacing={2}>
													<Grid item xs={12}>
														<TextField
															id="bedroomNumber"
															name={`typologies[${index}].bedroomNumber`}
															label={"Número de quartos"}
															value={formik.values.typologies.at(index)?.bedroomNumber || ""}
															onChange={formik.handleChange}
															// 							error={
															// 								formik.touched.typologies?.at(index)?.bedroomNumber &&
															// Boolean(formik.errors.typologies?.at(index)?.bedroomNumber)
															// 							}
															// 							helperText={
															// 								formik.touched.typologies?.at(index)?.bedroomNumber &&
															// formik.errors.typologies?.at(index)?.bedroomNumber
															// 							}
															fullWidth
														/>
													</Grid>
													<Grid item xs={12}>
														<TextField
															id="bathroomNumber"
															name={`typologies[${index}].bathroomNumber`}
															label={"Número de casas de banho"}
															value={formik.values.typologies.at(index)?.bathroomNumber || ""}
															onChange={formik.handleChange}
															// 							error={
															// 								formik.touched.typologies?.at(index)?.bedroomNumber &&
															// Boolean(formik.errors.typologies?.at(index)?.bathroomNumber)
															// 							}
															// 							helperText={
															// 								formik.touched.typologies?.at(index)?.bedroomNumber &&
															// formik.errors.typologies?.at(index)?.bathroomNumber
															// 							}
															fullWidth
														/>
													</Grid>
												</Grid>
											</AccordionDetails>
										</Accordion>
									);
								})}
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="location"
									name="location"
									label={"Localização (Cidade)"}
									value={formik.values.location}
									onChange={formik.handleChange}
									error={formik.touched.location && Boolean(formik.errors.location)}
									helperText={formik.touched.location && formik.errors.location}
									fullWidth
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="latitude"
									name="latitude"
									label={"latitude"}
									value={formik.values.latitude}
									onChange={formik.handleChange}
									error={formik.touched.latitude && Boolean(formik.errors.latitude)}
									// helperText={formik.touched.latitude && formik.errors.latitude}
									fullWidth
								/>
							</Grid>
							<Grid item xs={4}>
								<TextField
									id="longitude"
									name="longitude"
									label={"longitude"}
									value={formik.values.longitude}
									onChange={formik.handleChange}
									error={formik.touched.longitude && Boolean(formik.errors.longitude)}
									// helperText={formik.touched.longitude && formik.errors.longitude}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<Box id="map" style={{ height: 480}} sx={{pt: 2}}>
									<Map centerCoordinates={[38.56633674453089, -7.925327404275489]} markers={[ [formik.values.latitude, formik.values.longitude] ]}/>
								</Box>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6">Adicionar Foto de Capa</Typography>
								<CGSPDropzone
									maxContent={1}
									files={coverPhoto}
									onAddFile={handleAddCover}
									onDeleteFile={handleDeleteCover}
								/>
							</Grid>
							<Grid item xs={6}></Grid>
							<Grid item xs={12}>
								<Typography variant="h6">Adicionar Fotos</Typography>
								<CGSPDropzone
									maxContent={3}
									files={files}
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
