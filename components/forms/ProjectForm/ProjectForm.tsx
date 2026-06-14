import React, { useCallback, useState } from 'react';

import { useFormik } from 'formik';
import type { LatLngTuple } from 'leaflet';

import { ArrowBackIos, ArrowForwardIos, CheckCircle, Close } from '@mui/icons-material';
import {
	Container,
	FormControl,
	Grid2,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	Step,
	StepButton,
	Stepper,
	TextField,
	Typography
} from '@mui/material';
import { useTranslation } from 'next-i18next/pages';

import { AbstractFile, CancelModal, FileUploader, Loading, StyledButton } from '../..';
import { districtCenterCoordinates } from '../../projects/projectInventory/ProjectInventory';
import { SuccessMessage } from '../SuccessMessage';
import { dataFetch, submitFile } from '../utils';
import { LocationSection, districtList } from './LocationSection';
import { TypologiesSection } from './TypologiesSection';
import { getErrorMessage, getProjectInitialValues, projectValidationSchema, steps } from './utils';

export interface ProjectFormProps {
	project?: Project;
	onCancel?: () => void;
	onSubmit?: () => void;
}

export const ProjectForm = ({ project, onCancel, onSubmit }: ProjectFormProps) => {
	const { t } = useTranslation(['projectpage', 'common']);

	const [files, setFiles] = useState<AbstractFile[]>(project?.files ?? []);

	const [cancelModal, setCancelModal] = useState(false);

	const [submitting, setSubmitting] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState<string | undefined>(undefined);

	const [activeStep, setActiveStep] = React.useState(0);

	const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple>([
		38.56633674453089, -7.925327404275489
	]);

	const formik = useFormik({
		initialValues: getProjectInitialValues(project),
		validationSchema: projectValidationSchema,
		onSubmit: async (values) => {
			setSubmitting(true);

			// TODO: if this value is not user editable then it's declarion should be moved to the backend
			values = { ...values, createdOn: new Date(values.createdOn).toISOString() };

			const uploadPromises: Promise<unknown>[] = [
				...files.map((file) => submitFile(file)),
				...values.typologies.flatMap((typ) => (typ.plant ? [submitFile(typ.plant)] : []))
			];

			if (values.coverPhoto) {
				uploadPromises.push(submitFile(values.coverPhoto));
			}

			await Promise.all(uploadPromises);

			const formatValue = {
				title: values.title,
				assignmentStatus: values.assignmentStatus,
				constructionStatus: values.constructionStatus,
				district: values.district,
				county: values.county,
				lots: values.lots,
				assignedLots: values.assignedLots,
				typologies: values.typologies,
				coordinates: [values.latitude, values.longitude],
				coverPhoto: values.coverPhoto,
				files: files.map((file) => {
					return { filename: file.filename };
				}),
				createdOn: values.createdOn
			};

			postProject(formatValue);
		}
	});

	const onCoordinateChange = async ({
		values,
		district,
		county
	}: {
		values: LatLngTuple;
		district?: string;
		county?: string;
	}) => {
		formik.setValues(
			{
				...formik.values,
				latitude: values[0],
				longitude: values[1],
				...(district && { district: district }),
				...(county && { county: county })
			},
			true
		);
		setCenterCoordinates(values);
	};

	const handleClose = useCallback(
		(confirm: boolean) => {
			setCancelModal(false);
			confirm && onCancel?.();
		},
		[onCancel]
	);

	const handleDistrictChange = useCallback(
		(district: string | null) => {
			const newDistrict = district ?? '';
			if (newDistrict != formik.values.district) {
				formik.setFieldValue('district', newDistrict, true);
				formik.setFieldTouched('district', true, false);
				if (districtList.includes(newDistrict)) {
					const newCoordinates = districtCenterCoordinates[newDistrict];
					if (newCoordinates) {
						setCenterCoordinates(newCoordinates);
					}
				}
			}
		},
		[formik.values.district, formik.setFieldValue, formik.setFieldTouched]
	);

	const handleBack = useCallback(() => {
		setActiveStep((prevActiveStep) => (prevActiveStep - 1) % steps.length);
	}, []);

	const handleNext = useCallback(() => {
		setActiveStep((prevActiveStep) => (prevActiveStep + 1) % steps.length);
	}, []);

	const handleStep = useCallback((step: number) => {
		setActiveStep(step);
	}, []);

	const postProject = async (values: unknown) => {
		const endpoint = project
			? `${process.env.NEXT_PUBLIC_API_URL}/project/${project.id}`
			: `${process.env.NEXT_PUBLIC_API_URL}/project`;

		const res = await dataFetch('POST', endpoint, values, true)
			.then((response) => {
				if (response.ok) {
					setSuccess(true);
					onSubmit?.();
					return response.json();
				} else {
					throw new Error('Project Post ' + response.status);
				}
			})
			.catch(() => {
				setSuccess(false);
				setError('Erro a submeter Projeto');
			});

		setSubmitting(false);

		if (res) return res as Project;
	};

	return (
		<Paper sx={{ mt: 4 }}>
			<Container style={{ minHeight: 800 }}>
				<Grid2 container pt={2}>
					<Grid2 mt={4}>
						<Typography variant={'h4'}>
							{project ? 'Editar Projeto' : 'Adicionar Projeto'}
						</Typography>
					</Grid2>
					{onCancel ? (
						<Grid2 ml="auto">
							<IconButton
								onClick={() => {
									success ? onCancel() : setCancelModal(true);
								}}>
								<Close />
							</IconButton>
						</Grid2>
					) : (
						<></>
					)}
				</Grid2>
				{success ? (
					<SuccessMessage title={project ? 'Projeto Editado' : 'Novo Projeto Adicionado'} />
				) : (
					<form onSubmit={formik.handleSubmit}>
						<Grid2 container rowSpacing={4} pb={2} pt={4} columnSpacing={4}>
							<Grid2 size={{ xs: 12 }}>
								<Stepper nonLinear activeStep={activeStep}>
									{steps.map((label, index) => (
										<Step key={label}>
											<StepButton onClick={() => handleStep(index)}>{label}</StepButton>
										</Step>
									))}
								</Stepper>
							</Grid2>
							{activeStep === 0 && (
								<React.Fragment>
									<Grid2 size={{ xs: 12 }}>
										<Typography variant={'h6'}>Detalhes do Projeto</Typography>
									</Grid2>
									<Grid2 size={{ xs: 12 }}>
										<TextField
											id="title"
											name="title"
											label={'Nome do projeto'}
											value={formik.values.title}
											onChange={formik.handleChange}
											error={formik.touched.title && Boolean(formik.errors.title)}
											helperText={formik.errors.title}
											fullWidth
										/>
									</Grid2>
									<Grid2 size={{ xs: 4 }}>
										<FormControl sx={{ width: '100%' }}>
											<InputLabel id="assignment-status-select-dropdown-label">
												Estado de Atribuição
											</InputLabel>
											<Select
												label="Assignment Status"
												labelId="assignment-status-select-dropdown-label"
												id="assignment-status-select-dropdown"
												name="assignmentStatus"
												value={formik.values.assignmentStatus}
												error={
													formik.touched.assignmentStatus && Boolean(formik.errors.assignmentStatus)
												}
												onChange={formik.handleChange}
												sx={{ width: '100%' }}>
												<MenuItem value={'WAITING'}>{t('assignmentStatus.WAITING')}</MenuItem>
												<MenuItem value={'ONGOING'}>{t('assignmentStatus.ONGOING')}</MenuItem>
												<MenuItem value={'CONCLUDED'}>{t('assignmentStatus.CONCLUDED')}</MenuItem>
											</Select>
										</FormControl>
									</Grid2>
									<Grid2 size={{ xs: 4 }}>
										<FormControl sx={{ width: '100%' }}>
											<InputLabel id="construction-status-select-dropdown-label">
												Estado de Construção
											</InputLabel>
											<Select
												label="Construction Status"
												labelId="construction-status-select-dropdown-label"
												id="construction-status-select-dropdown"
												name="constructionStatus"
												value={formik.values.constructionStatus}
												error={
													formik.touched.constructionStatus &&
													Boolean(formik.errors.constructionStatus)
												}
												onChange={formik.handleChange}
												sx={{ width: '100%' }}>
												<MenuItem value={'ALLOTMENTPERMIT'}>
													{t('constructionStatus.ALLOTMENTPERMIT')}
												</MenuItem>
												<MenuItem value={'BUILDINGPERMIT'}>
													{t('constructionStatus.BUILDINGPERMIT')}
												</MenuItem>
												<MenuItem value={'CONCLUDED'}>{t('constructionStatus.CONCLUDED')}</MenuItem>
											</Select>
										</FormControl>
									</Grid2>
									<Grid2 size={{ xs: 4 }}>
										<TextField
											id="lots"
											name="lots"
											label={'Lotes'}
											value={formik.values.lots}
											onChange={formik.handleChange}
											error={formik.touched.lots && Boolean(formik.errors.lots)}
											helperText={formik.errors.lots}
											fullWidth
										/>
									</Grid2>
									<Grid2 size={{ xs: 4 }}>
										<TextField
											id="assignedLots"
											name="assignedLots"
											label={'Lotes Atribuídos'}
											value={formik.values.assignedLots}
											onChange={formik.handleChange}
											error={formik.touched.assignedLots && Boolean(formik.errors.assignedLots)}
											helperText={formik.errors.assignedLots}
											fullWidth
										/>
									</Grid2>
									<Grid2 size={{ xs: 6 }}>
										<TextField
											id="createdOn"
											name="createdOn"
											label={'Data de Anunciamento do Projeto'}
											onChange={formik.handleChange}
											value={formik.values.createdOn}
											type="date"
											fullWidth
											helperText="Se este campo não for alterado a data será a de criação."
										/>
									</Grid2>
									<Grid2 size={{ xs: 12 }}>
										<FileUploader
											name="coverPhoto"
											title="Adicionar Foto de Capa"
											maxFiles={1}
											files={formik.values.coverPhoto ? [formik.values.coverPhoto] : []}
											onChange={(value) =>
												formik.setFieldValue('coverPhoto', value[0] || undefined)
											}
										/>
									</Grid2>
								</React.Fragment>
							)}
							{activeStep == 1 && (
								<LocationSection
									formik={formik}
									centerCoordinates={centerCoordinates}
									onCoordinateChange={onCoordinateChange}
									handleDistrictChange={handleDistrictChange}
								/>
							)}
							{activeStep == 2 && <TypologiesSection formik={formik} />}
							{activeStep == 3 && (
								<Grid2 size={{ xs: 12 }}>
									<FileUploader
										name="photos"
										title="Adicionar Fotos"
										maxFiles={30}
										files={files}
										onChange={(value) => setFiles(value)}
									/>
								</Grid2>
							)}
						</Grid2>
						<Grid2 container rowSpacing={4} pb={2} columnSpacing={4}>
							<Grid2 size={{ xs: 6 }}>
								<StyledButton
									variant="contained"
									color="primary"
									disabled={activeStep == 0}
									onClick={handleBack}
									startIcon={<ArrowBackIos />}>
									Passo Anterior
								</StyledButton>
							</Grid2>
							<Grid2 size={{ xs: 6 }} textAlign="end">
								<StyledButton
									variant="contained"
									color="primary"
									disabled={activeStep == steps.length - 1}
									onClick={handleNext}
									endIcon={<ArrowForwardIos />}>
									Próximo Passo
								</StyledButton>
							</Grid2>
							<Grid2 size={{ xs: 'auto' }} ml="auto">
								{submitting ? (
									<Loading />
								) : success ? (
									<CheckCircle color={'success'} style={{ fontSize: '50px' }} />
								) : (
									<Typography color={'error'}>
										{formik.submitCount > 0 && !formik.isValid
											? getErrorMessage(formik.errors, t)
											: error}
									</Typography>
								)}
							</Grid2>
							<Grid2 size={{ xs: 'auto' }}>
								<StyledButton
									type="submit"
									variant="contained"
									color="primary"
									value="submit"
									fullWidth
									disabled={submitting}>
									{'Submeter'}
								</StyledButton>
							</Grid2>
							{onCancel && (
								<Grid2 size={{ xs: 'auto' }}>
									<StyledButton variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
										Cancelar
									</StyledButton>
								</Grid2>
							)}
						</Grid2>
					</form>
				)}
			</Container>
			<CancelModal
				open={cancelModal}
				handleClose={(confirm) => handleClose(confirm)}
				title="Cancelar Criação de Projeto"
			/>
		</Paper>
	);
};
