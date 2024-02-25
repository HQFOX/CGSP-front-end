/* eslint-disable @typescript-eslint/no-explicit-any */
import React , { useCallback, useRef, useState } from "react";

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
	Stepper,
	Step,
	StepButton,
	InputAdornment,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, CheckCircle, Close, ExpandMore } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";

import dynamic from "next/dynamic";

import { CGSPDropzone } from "../dropzone/Dropzone";
import { CancelModal } from "../modals/CancelModal";
import { StyledButton } from "../Button";
import { getPresignedUrl, submitFile, useFetch } from "./utils";
import { AbstractFile } from "./types";
import { useTranslation } from "react-i18next";
import { Loading } from "../loading/Loading";
import { LatLngTuple } from "leaflet";
import { districtCenterCoordinates } from "../projects/projectInventory/ProjectInventory";

const Map = dynamic(() => import("../map/Map"), {
	ssr: false
},
);

const districtList = [ "Évora", "Beja", "Portalegre", "Setúbal" , "Aveiro", "Braga" ];

const steps = ["Detalhes", "Localização", "Tipologias", "Fotografias"];

export const ProjectForm = ({ project, onCancel, onSubmit }: { project?: Project, onCancel: () => void, onSubmit: () => void}) => {

	const { t } = useTranslation(["projectpage", "common"]);

	const [files, setFiles] = useState<AbstractFile[]>(project?.files ?? []);

	const [typologyIndex, setTypologyIndex] = useState(0);
	const [cancelModal, setCancelModal] = useState(false);

	const [submitting, setSubmitting] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState<string | undefined>(undefined);

	const [activeStep, setActiveStep] = React.useState(0);

	const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple>([38.56633674453089, -7.925327404275489]);

	const ref = useRef(null);

	const formik = useFormik({
		initialValues: {
			title: project?.title ?? "",
			assignmentStatus: project?.assignmentStatus ?? "WAITING",
			constructionStatus: project?.constructionStatus ?? "ALLOTMENTPERMIT",
			coverPhoto: project?.coverPhoto as AbstractFile | undefined ?? undefined,
			district: project?.district ?? "",
			county: project?.county ?? "",
			lots: project ? project.lots : 0,
			assignedLots: project ? project.assignedLots : 0,
			typology: [] as { index: number; typology: string; }[], // TODO: add initial value
			typologies: [] as { bedroomNumber?: number; bathroomNumber?: number; garageNumber?: number; area?: number; price?: number; plant? : AbstractFile}[],
			latitude: project?.coordinates ? project.coordinates[0] : 38.56633674453089,
			longitude: project?.coordinates ? project.coordinates[1] : -7.925327404275489,
			files: [] as { filename: string }[]
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Obrigatório"),
			district: Yup.string().required("Obrigatório"),
			lots: Yup.number().required("Obrigatório"),
			assignedLots: Yup.number().required("Obrigatório"),
			typology: Yup.array().of(
				Yup.object().shape({
					index: Yup.string(),
					typology: Yup.string(),
				})
			),
			typologies: Yup.array().of(
				Yup.object().shape({
					bedroomNumber: Yup.number(),
					bathroomNumber: Yup.number(),
					garageNumber: Yup.number(),
					area: Yup.number(),
					price: Yup.number(),

				})
			),
			latitude: Yup.number().required("Obrigatório"),
			longitude: Yup.number().required("Obrigatório")
		}),
		onSubmit: async (values) => {

			if(values.coverPhoto){
				submitFile(values.coverPhoto);
			}
				
			Promise.all(files.map( async (file) => submitFile(file)))
				.then( async res => {

					Promise.all(values.typologies.map( (typ) => typ.plant &&
							submitFile(typ.plant))).then( async plantRes => {



						const formatValue = {
							title: values.title,
							assignmentStatus: values.assignmentStatus,
							constructionStatus: values.constructionStatus,
							district: values.district,
							lots: values.lots,
							assignedLots: values.assignedLots,
							typologies: values.typologies,
							coordinates: [values.latitude, values.longitude],
							coverPhoto: values.coverPhoto,
							files: files.map( file => { return { "filename": file.filename};})
						};
								
						console.log(formatValue);
						postProject(formatValue);

					});
				});

		}
	});

	const onCoordinateChange = async (values: LatLngTuple) => {

		const geoApiInfo = await fetch(`https://json.geoapi.pt/gps/${values[0]},${values[1]}`).then( res => (res.ok ? res.json() : undefined));

		if(geoApiInfo){
			formik.setValues({...formik.values,latitude: values[0],  longitude: values[1], district: geoApiInfo.distrito, county: geoApiInfo.concelho});
			setCenterCoordinates(values);
		}
	};

	const handleTypologyDelete = (index: number | undefined) => {
		formik.setValues({
			...formik.values,
			typology: formik.values.typology.filter((value) => value.index != index)
		});
	};

	const handleTypologyAdd = (option: string) => {
		const newIndex = typologyIndex + 1;
		const newTypology = { index: newIndex, typology: option };
		setTypologyIndex(newIndex);
		formik.setValues({
			...formik.values,
			typology: formik.values.typology.concat(newTypology as { index: number; typology: ""; plant?: AbstractFile }),
			typologies: formik.values.typologies.concat({ bedroomNumber: 0, bathroomNumber: 0, garageNumber: 0, area: 0, price: 0})
		});
	};

	const onTypologyChange = (e: React.SyntheticEvent, value: string[], reason: string) => {
		console.log(value);
		if((reason) === "selectOption" || reason === "createOption"){
			handleTypologyAdd(value[value.length - 1]);
		}
	};

	const handleAddFile = async (newfiles: File[]) => {
		newfiles.map( file =>  getPresignedUrl(file).then( value => value && setFiles([...files, value])));
	};

	const handleDeleteFile = (file: AbstractFile) => {
		setFiles(files.filter( item => item != file));
	};

	const handleAddCover = async (newfiles: File[]) => {
		newfiles.map( file =>  getPresignedUrl(file).then( value => {
			if(value){
				formik.setValues({
					...formik.values,
					coverPhoto: value
				});
			}}));
	};

	const handleDeleteCover = () => {
		formik.setValues({
			...formik.values,
			coverPhoto: undefined
		});
	};

	const handleAddPlant = async (newfiles: File[], index: number) => {

		newfiles.map( file =>  getPresignedUrl(file).then( value => {
			// value && setPlants([...files, value])
			if(value){
				const updatedTypologies = formik.values.typologies;

				updatedTypologies[index] = {...updatedTypologies[index], plant: value };
		
				formik.setValues({
					...formik.values,
					typologies: updatedTypologies
				});

			}
		
		}));


	};

	const handleDeletePlant = (index: number) => {
		const updatedTypologies = formik.values.typologies;

		const updatedTypology = updatedTypologies[index];

		delete updatedTypology.plant;

		updatedTypologies[index] = updatedTypology;

		formik.setValues({
			...formik.values,
			typologies: updatedTypologies
		});
	};

	const handleClose = (confirm: boolean) => {
		setCancelModal(false);
		confirm && onCancel();
	};

	const handleDistrictChange = (district: string| null) => {
		if(district && district != formik.values.district){
			formik.setValues({
				...formik.values,
				district: district
			});
			if(districtList.includes(district)){
				const newCoordinates = districtCenterCoordinates[district];
				if(newCoordinates){
					setCenterCoordinates(newCoordinates);
				}
			}
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => (prevActiveStep - 1 ) % steps.length);
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => (prevActiveStep + 1 ) % steps.length);
	  };

	  const handleStep = (step: number) => () => {
		setActiveStep(step);
	  };

	const postProject = async (values: unknown) => {

		const endpoint = project ? `${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}` : `${process.env.NEXT_PUBLIC_API_URL}/project` ;

		const res = await useFetch(project ? "PUT" : "POST", endpoint, values, true).then( (response) => {
			if(response.ok){
				setSuccess(true);
				onSubmit();
				return response.json();
			}
			else {
				console.log(values);
				throw new Error("Project Post " + response.status);
			}
		}).catch( error => {
			setSuccess(false);
			setError("Erro a submeter Projeto");
			console.log(error);
		});

		setSubmitting(false);

		if(res)
			return res as Project;
		return undefined;
	};

	return (
		<Paper sx={{ mt: 4 }}>
			<Container>
				<Grid container pt={2}>
					<Grid item mt={4}>
						<Typography variant={"h4"}>{ project ? "Editar Projeto": "Adicionar Projeto"}</Typography>
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
							<Typography variant="h5">Novo Projeto Adicionado</Typography>
							<Typography variant="subtitle1"></Typography>
						</Stack>
					</Grow>
				) : (
					<form onSubmit={formik.handleSubmit}>
						<Grid container rowSpacing={4} pb={2} pt={4} columnSpacing={4}>
							<Grid item xs={12}>
								<Stepper nonLinear activeStep={activeStep}>
									{steps.map((label, index) => (
										<Step key={label}>
											<StepButton onClick={handleStep(index)}>
												{label}
											</StepButton>
										</Step>
									))}
								</Stepper>
							</Grid>
							{activeStep === 0 &&
							<React.Fragment><Grid item xs={12}>
								<Typography variant={"h6"}>Detalhes do Projeto</Typography>
							</Grid><Grid item xs={12}>
								<TextField
									id="title"
									name="title"
									label={"Nome do projeto"}
									value={formik.values.title}
									onChange={formik.handleChange}
									error={formik.touched.title && Boolean(formik.errors.title)}
									helperText={formik.touched.title && formik.errors.title}
									fullWidth />
							</Grid><Grid item xs={4}>
								<FormControl sx={{ width: "100%" }}>
									<InputLabel id="assignment-status-select-dropdown-label">Estado de Atribuição</InputLabel>
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
							</Grid><Grid item xs={4}>
								<FormControl sx={{ width: "100%" }}>
									<InputLabel id="construction-status-select-dropdown-label">Estado de Construção</InputLabel>
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
							</Grid><Grid item xs={4}>
								<TextField
									id="lots"
									name="lots"
									label={"Lotes"}
									value={formik.values.lots}
									onChange={formik.handleChange}
									error={formik.touched.lots && Boolean(formik.errors.lots)}
									helperText={formik.touched.lots && formik.errors.lots}
									type="number"
									fullWidth />
							</Grid><Grid item xs={4}>
								<TextField
									id="assignedLots"
									name="assignedLots"
									label={"Lotes Atribuídos"}
									value={formik.values.assignedLots}
									onChange={formik.handleChange}
									error={formik.touched.assignedLots && Boolean(formik.errors.assignedLots)}
									helperText={formik.touched.assignedLots && formik.errors.assignedLots}
									type="number"
									fullWidth />
							</Grid>
							<Grid item xs={12}>
								<Typography variant="h6">Adicionar Foto de Capa</Typography>
								<CGSPDropzone
									maxContent={1}
									files={formik.values.coverPhoto ? [formik.values.coverPhoto] : undefined}
									onAddFile={handleAddCover}
									onDeleteFile={handleDeleteCover}
								/>
							</Grid>
							</React.Fragment>							
							}
							{activeStep == 1 && 
							<React.Fragment><Grid item xs={12}>
								<Typography variant={"h6"}>Localização</Typography>
							</Grid><Grid item xs={3}>
								<Autocomplete
									id="district"
									options={districtList}
									value={formik.values.district}
									onChange={(e,value,reason) => handleDistrictChange(value, reason === "selectOption")}
									fullWidth
									renderInput={(params) => <TextField {...params} label={"Distrito"} error={formik.touched.district && Boolean(formik.errors.district)} helperText={formik.touched.district && formik.errors.district} />} />
							</Grid><Grid item xs={3}>
								<TextField
									id="county"
									name="county"
									label={"Concelho"}
									value={formik.values.county}
									onChange={formik.handleChange}
									error={formik.touched.county && Boolean(formik.errors.county)}
									helperText={formik.touched.county && formik.errors.county}
									fullWidth />
							</Grid><Grid item xs={3}>
								<TextField
									id="latitude"
									name="latitude"
									label={"latitude"}
									value={formik.values.latitude}
									onChange={formik.handleChange}
									error={formik.touched.latitude && Boolean(formik.errors.latitude)}
									helperText={formik.touched.latitude && formik.errors.latitude}
									fullWidth />
							</Grid><Grid item xs={3}>
								<TextField
									id="longitude"
									name="longitude"
									label={"longitude"}
									value={formik.values.longitude}
									onChange={formik.handleChange}
									error={formik.touched.longitude && Boolean(formik.errors.longitude)}
									helperText={formik.touched.longitude && formik.errors.longitude}
									fullWidth />
							</Grid><Grid item xs={12}>
								<Typography>Arraste o Marcador para preencher automaticamente</Typography>
								<Box id="map" style={{ height: 480 }} sx={{ pt: 2 }}>
									<Map doubleClickZoom={false} scrollWheelZoom={true} centerCoordinates={centerCoordinates} markers={formik.values.latitude && formik.values.longitude ? [[formik.values.latitude, formik.values.longitude]] : []} onCoordinateChange={onCoordinateChange} changeView/>
								</Box>
							</Grid></React.Fragment>							
							}
							{activeStep == 2 && 
								<React.Fragment><Grid item xs={12}>
									<Typography variant={"h6"}>Tipologias</Typography>
								</Grid><Grid item xs={12}>
									<Autocomplete
										multiple
										options={["T0","T1","T2","T3","T4"]}
										freeSolo
										value={formik.values.typology.map((element) => element.typology)}
										// defaultValue={formik.values.typology.map((element) => element.typology)}
										onChange={ (e,v,r) => onTypologyChange(e,v,r)}
										getOptionLabel={(option) => option}
										renderTags={(value, getTagProps) => value.map((option, index) => (
											// eslint-disable-next-line react/jsx-key
											<Chip
												variant="outlined"
												label={option}
												{...getTagProps({ index })}
												onDelete={() => handleTypologyDelete(formik.values.typology.at(index)?.index)} />
										))}
										renderInput={(params) => (
											<TextField
												ref={ref}
												{...params}
												label={"tipologia"}
												 />
										)} />
								</Grid><Grid item xs={12}>
									{formik.values.typology.map((typology, index) => {
										return (
											<Accordion key={"typologyDetails" + index} defaultExpanded={index == 0}>
												<AccordionSummary
													expandIcon={<ExpandMore />}
													aria-controls={`${typology}-content-${index}`}
													id={`${typology}-header-${index}`}>
													<Typography>{typology.typology}</Typography>
												</AccordionSummary>
												<AccordionDetails>
													<Grid container rowSpacing={4} columnSpacing={4}>
														<Grid item xs={6}>
															<TextField
																id="bedroomNumber"
																name={`typologies[${index}].bedroomNumber`}
																label={"Número de quartos"}
																value={formik.values.typologies.at(index)?.bedroomNumber}
																onChange={formik.handleChange}
																type="number"
																error={
																	formik.touched.typologies?.at(index)?.bedroomNumber &&
																Boolean(formik.errors.typologies?.at(index)?.bedroomNumber)
																}
																helperText={
																	formik.touched.typologies?.at(index)?.bedroomNumber &&
																formik.errors.typologies?.at(index)?.bedroomNumber
																}
																fullWidth />
														</Grid>
														<Grid item xs={6}>
															<TextField
																id="bathroomNumber"
																name={`typologies[${index}].bathroomNumber`}
																label={"Número de casas de banho"}
																value={formik.values.typologies.at(index)?.bathroomNumber}
																onChange={formik.handleChange}
																type="number"
																error={
																	formik.touched.typologies?.at(index)?.bathroomNumber &&
																Boolean(formik.errors.typologies?.at(index)?.bathroomNumber)
																}
																helperText={
																	formik.touched.typologies?.at(index)?.bathroomNumber &&
																formik.errors.typologies?.at(index)?.bathroomNumber
																}
																fullWidth />
														</Grid>
														<Grid item xs={6}>
															<TextField
																id="garageNumber"
																name={`typologies[${index}].garageNumber`}
																label={"Garagens"}
																value={formik.values.typologies.at(index)?.garageNumber}
																onChange={formik.handleChange}
																error={
																	formik.touched.typologies?.at(index)?.garageNumber &&
																Boolean(formik.errors.typologies?.at(index)?.garageNumber)
																}
																helperText={
																	formik.touched.typologies?.at(index)?.garageNumber &&
																formik.errors.typologies?.at(index)?.garageNumber
																}
																fullWidth />
														</Grid>
														<Grid item xs={6}>
															<TextField
																id="area"
																name={`typologies[${index}].area`}
																label={"Area"}
																value={formik.values.typologies.at(index)?.area}
																onChange={formik.handleChange}
																fullWidth
																type="number"
																InputProps={{
																	endAdornment: <InputAdornment position="start">{"\u33A1"}</InputAdornment>,
																}}
																error={
																	formik.touched.typologies?.at(index)?.area &&
																Boolean(formik.errors.typologies?.at(index)?.area)
																}
																helperText={
																	formik.touched.typologies?.at(index)?.area &&
																formik.errors.typologies?.at(index)?.area
																}
															/>
														</Grid>
														<Grid item xs={6}>
															<TextField
																id="price"
																name={`typologies[${index}].price`}
																label={"Preço"}
																value={formik.values.typologies.at(index)?.price}
																onChange={formik.handleChange}
																fullWidth
																type="number"
																InputProps={{
																	endAdornment: <InputAdornment position="start">€</InputAdornment>,
																  }}
																  error={
																	formik.touched.typologies?.at(index)?.price &&
																Boolean(formik.errors.typologies?.at(index)?.price)
																}
																helperText={
																	formik.touched.typologies?.at(index)?.price &&
																formik.errors.typologies?.at(index)?.price
																}
															/>
														</Grid>
														<Grid item xs={12}>
															<Typography variant="h6">Adicionar Planta</Typography>
															<CGSPDropzone
																maxContent={1}
																files={formik.values.typologies.at(index)?.plant != undefined ? [formik.values.typologies.at(index)?.plant] : undefined }
																onAddFile={ (files) => handleAddPlant(files,index)}
																onDeleteFile={ () => handleDeletePlant(index)} />
														</Grid>
													</Grid>
												</AccordionDetails>
											</Accordion>
										);
									})}
								</Grid></React.Fragment>
							}
							{activeStep == 3 && 
								<Grid item xs={12}>
									<Typography variant="h6">Adicionar Fotos</Typography>
									<CGSPDropzone
										maxContent={3}
										files={files}
										onAddFile={handleAddFile}
										onDeleteFile={handleDeleteFile}
									/>
								</Grid>
							}
							<Grid item xs={6}>
								<StyledButton variant="contained" color="primary" disabled={activeStep == 0} onClick={handleBack} startIcon={<ArrowBackIos />}>
									Passo Anterior
								</StyledButton>
							</Grid>
							<Grid item textAlign="end" xs={6}>
								<StyledButton variant="contained" color="primary" disabled={activeStep == steps.length -1} onClick={handleNext} endIcon={<ArrowForwardIos />}>
									Próximo Passo
								</StyledButton>
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
			<CancelModal open={cancelModal} handleClose={(confirm) => handleClose(confirm)} title="Cancelar Criação de Projeto"/>
		</Paper>
	);
};
