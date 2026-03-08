import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { CheckCircle, Close } from '@mui/icons-material';
import {
	Container,
	Grid2,
	IconButton,
	MenuItem,
	Paper,
	TextField,
	Typography
} from '@mui/material';

import { FileUploader, Loading, StyledButton } from '../../../components';
import { CancelModal } from '../../modals/CancelModal';
import { SuccessMessage } from '../SuccessMessage';
import { dataFetch, submitFile } from '../utils';

export const UpdateForm = ({
	update,
	projects,
	onCancel,
	onSubmit
}: {
	update?: Update;
	projects?: Project[];
	onCancel: () => void;
	onSubmit: () => void;
}) => {
	const [cancelModal, setCancelModal] = useState(false);

	const [submitting, setSubmitting] = useState(false);

	const [success, setSuccess] = useState(false);

	const [error, setError] = useState<string | undefined>(undefined);

	const formik = useFormik({
		initialValues: {
			id: update?.id ?? '0',
			title: update?.title ?? '',
			content: update?.content ?? '',
			project: update?.project ?? null,
			createdOn: update?.createdOn
				? new Date(update.createdOn).toISOString().slice(0, 10)
				: new Date().toISOString().slice(0, 10),
			files: update?.files ?? []
		},
		validationSchema: Yup.object({
			title: Yup.string().required('Obrigatório'),
			content: Yup.string()
		}),
		onSubmit: async (values) => {
			setSubmitting(true);

			values = { ...values, createdOn: new Date(values.createdOn).toISOString() };

			Promise.all(values.files.map(async (file) => submitFile(file)))
				.then(async () => {
					const valuesWithImage = {
						...values,
						files: values.files.map((file) => {
							return { filename: file.filename };
						})
					};

					postUpdate(valuesWithImage);
				})
				.catch((error) => {
					setError('Erro a submeter Imagens');
					console.log(error);
				})
				.finally(() => {
					setSubmitting(false);
				});
		}
	});

	const handleClose = (confirm: boolean) => {
		setCancelModal(false);
		confirm && onCancel();
	};

	const postUpdate = async (values: unknown) => {
		const endpoint = update
			? `${process.env.NEXT_PUBLIC_API_URL}/update/${update.id}`
			: `${process.env.NEXT_PUBLIC_API_URL}/update`;

		const res = await dataFetch('POST', endpoint, values, true)
			.then((response) => {
				if (response.ok) {
					setSuccess(true);
					onSubmit();
					return response.json();
				} else {
					throw new Error('Update Post ' + response.status);
				}
			})
			.catch((error) => {
				setSuccess(false);
				setError('Erro a submeter Atualização');
				console.log(error);
			});

		if (res) return res as Update;
		return undefined;
	};

	return (
		<Paper sx={{ mt: 4, minHeight: 600 }}>
			<Container>
				<Grid2 container pt={2}>
					<Grid2 size="grow" mt={4}>
						<Typography variant={'h5'}>
							{update ? 'Editar Atualização' : 'Criar Atualização'}
						</Typography>
					</Grid2>
					<Grid2 size="auto">
						<IconButton
							onClick={() => {
								success ? onCancel() : setCancelModal(true);
							}}>
							<Close />
						</IconButton>
					</Grid2>
				</Grid2>
				{success ? (
					<SuccessMessage
						title={update ? 'Atualização Editada' : 'Nova Atualização Adicionada'}
						subtitle={'Confirme na tabela de atualizações ou na página pública de atualizações'}
					/>
				) : (
					<form onSubmit={formik.handleSubmit}>
						<Grid2 container spacing={4} pb={2} pt={4}>
							<Grid2 size={{ xs: 12 }}>
								<TextField
									id="title"
									name="title"
									label={'Título'}
									value={formik.values.title}
									onChange={formik.handleChange}
									error={formik.touched.title && Boolean(formik.errors.title)}
									helperText={formik.touched.title && formik.errors.title}
									fullWidth
								/>
							</Grid2>
							<Grid2 size={{ xs: 12 }}>
								<FileUploader
									name="file"
									label="Adicionar Foto à Atualização"
									files={formik.values.files}
									onChange={(value) => formik.setFieldValue('files', value)}
									error={(formik.errors.files ?? []) as string[]}
									maxFiles={1}
								/>
							</Grid2>
							<Grid2 size={{ xs: 12 }}>
								<TextField
									id="content"
									name="content"
									label={'Conteúdo'}
									value={formik.values.content}
									onChange={formik.handleChange}
									error={formik.touched.content && Boolean(formik.errors.content)}
									helperText={formik.touched.content && formik.errors.content}
									fullWidth
									multiline
									minRows={3}
								/>
							</Grid2>
							{projects && projects.length > 0 && (
								<Grid2 size={{ xs: 12, sm: 6 }}>
									<TextField
										id="projectId"
										name="project.projectId"
										label={'Projeto Relacionado: '}
										select
										value={formik.values.project?.projectId}
										onChange={formik.handleChange}
										fullWidth
										helperText="Projeto sobre ao qual esta atualização se refere.">
										{projects &&
											projects.length > 0 &&
											projects.map((option) => (
												<MenuItem key={option.id} value={option.id}>
													{option.title}
												</MenuItem>
											))}
									</TextField>
								</Grid2>
							)}
							<Grid2 size={{ xs: 12, sm: 6 }}>
								<TextField
									id="createdOn"
									name="createdOn"
									label={'Data de Lançamento da Atualização'}
									onChange={formik.handleChange}
									value={formik.values.createdOn}
									type="date"
									fullWidth
									helperText="Se este campo não for alterado a data será a de criação."
								/>
							</Grid2>
							<Grid2 size="grow" ml="auto">
								{submitting ? (
									<Loading />
								) : success ? (
									<CheckCircle color={'success'} style={{ fontSize: '50px' }} />
								) : (
									<Typography color={'error'}>{error}</Typography>
								)}
							</Grid2>
							<Grid2 size="auto">
								<StyledButton
									type="submit"
									variant="contained"
									color="primary"
									value="submit"
									fullWidth>
									{'Submeter'}
								</StyledButton>
							</Grid2>
							<Grid2 size="auto">
								<StyledButton variant="outlined" onClick={() => setCancelModal(true)} fullWidth>
									Cancelar
								</StyledButton>
							</Grid2>
						</Grid2>
					</form>
				)}
			</Container>
			<CancelModal
				open={cancelModal}
				handleClose={(confirm) => handleClose(confirm)}
				title="Cancelar Criação de Update"
			/>
		</Paper>
	);
};
