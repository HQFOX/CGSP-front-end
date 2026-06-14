import { FormikErrors } from 'formik';
import * as Yup from 'yup';

import { AbstractFile } from '../../FileUploader';
import { TypologyDetailsForm } from '../types';

export const steps = ['Detalhes', 'Localização', 'Tipologias', 'Fotografias'];

const numberText = 'Este valor tem que ser um número.';
const required = 'Campo Obrigatório.';
const assignedLotsText =
	'O número de lotes reservado não pode ser maior que o número de lotes desta tipologia.';

export const projectValidationSchema = Yup.object({
	title: Yup.string().required(required),
	district: Yup.string().required(required),
	lots: Yup.number().typeError(numberText).required(required),
	assignedLots: Yup.number().typeError(numberText).required(required),
	typologies: Yup.array().of(
		Yup.object().shape({
			typology: Yup.string(),
			bedroomNumber: Yup.number().typeError(numberText).nullable(),
			bathroomNumber: Yup.number().typeError(numberText).nullable(),
			garageNumber: Yup.number().typeError(numberText).nullable(),
			totalLotArea: Yup.number().typeError(numberText).nullable(),
			livingArea: Yup.number().typeError(numberText).nullable(),
			price: Yup.number().typeError(numberText).nullable(),
			lots: Yup.number().typeError(numberText).nullable(),
			assignedLots: Yup.number()
				.typeError(numberText)
				.nullable()
				.max(Yup.ref('lots'), assignedLotsText)
		})
	),
	latitude: Yup.number().required(required),
	longitude: Yup.number().required(required)
});

export const getErrorMessage = (errors: FormikErrors<any>, t?: any) => {
	const result = [];
	for (const key of Object.keys(errors)) {
		const field = t(`projectDetails.${key}`);
		result.push(`Erro no campo ${field}. `);
	}
	return result;
};

export const getProjectInitialValues = (project?: Project) => ({
	id: project?.id ?? '0',
	title: project?.title ?? '',
	assignmentStatus: project?.assignmentStatus ?? 'WAITING',
	constructionStatus: project?.constructionStatus ?? 'ALLOTMENTPERMIT',
	coverPhoto: (project?.coverPhoto as AbstractFile | undefined) ?? undefined,
	district: project?.district ?? '',
	county: project?.county ?? '',
	lots: project ? project.lots : 0,
	assignedLots: project ? project.assignedLots : 0,
	createdOn: project?.createdOn
		? new Date(project.createdOn).toISOString().slice(0, 10)
		: new Date().toISOString().slice(0, 10),
	typologies: (project?.typologies?.map((value, index) => ({ ...value, index: index })) ??
		[]) as TypologyDetailsForm[],
	latitude: project?.coordinates ? project.coordinates[0] : 38.56633674453089,
	longitude: project?.coordinates ? project.coordinates[1] : -7.925327404275489,
	files: [] as { filename: string }[]
});
