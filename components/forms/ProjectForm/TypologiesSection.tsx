import React, { useState } from 'react';

import { useFormik } from 'formik';

import { ExpandMore } from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Chip,
	Grid2,
	InputAdornment,
	TextField,
	Typography
} from '@mui/material';

import { AbstractFile, FileUploader } from '../..';
import { TypologyDetailsForm } from '../types';

interface TypologiesSectionProps {
	formik: ReturnType<typeof useFormik<any>>;
}

export const TypologiesSection = ({ formik }: TypologiesSectionProps) => {
	const [typologyIndex, setTypologyIndex] = useState(0);

	const handleTypologyDelete = (index: number | undefined) => {
		formik.setValues({
			...formik.values,
			typologies: formik.values.typologies.filter(
				(value: TypologyDetailsForm) => value.index != index
			)
		});
	};

	const handleTypologyAdd = (option: string) => {
		const newIndex = typologyIndex + 1;
		const newTypology = { index: newIndex, typology: option };
		setTypologyIndex(newIndex);
		formik.setValues({
			...formik.values,
			typologies: [
				...formik.values.typologies,
				{
					...newTypology,
					bedroomNumber: undefined,
					bathroomNumber: undefined,
					garageNumber: undefined,
					totalLotArea: undefined,
					livingArea: undefined,
					price: undefined,
					plant: undefined,
					lots: undefined,
					assignedLots: undefined
				} as TypologyDetailsForm
			]
		});
	};

	const onTypologyChange = (
		_e: React.SyntheticEvent,
		value: (string | undefined)[],
		reason: string
	) => {
		if (
			reason === 'selectOption' ||
			(reason === 'createOption' && typeof value[value.length - 1] === 'string')
		) {
			handleTypologyAdd(value[value.length - 1] as string);
		}
	};

	return (
		<React.Fragment>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant={'h6'}>Tipologias</Typography>
			</Grid2>
			<Grid2 size={{ xs: 12 }}>
				<Autocomplete
					multiple
					options={['T0', 'T1', 'T2', 'T3', 'T4', 'T5']}
					isOptionEqualToValue={(_option, _value) => false}
					freeSolo
					value={
						formik.values.typologies
							.map((element: TypologyDetailsForm) => element.typology)
							.filter((element: unknown) => typeof element === 'string') as string[]
					}
					onChange={onTypologyChange}
					getOptionLabel={(option: string) => option}
					renderTags={(value: string[], getTagProps: (params: { index: number }) => object) =>
						value.map((option, index) => (
							// eslint-disable-next-line react/jsx-key
							<Chip
								variant="outlined"
								label={option}
								{...getTagProps({ index })}
								onDelete={() => handleTypologyDelete(formik.values.typologies.at(index)?.index)}
							/>
						))
					}
					renderInput={(params) => (
						<TextField
							{...params}
							label={'tipologia'}
							helperText="Adicione uma tipologia para fornecer mais detalhes. Pode selecionar uma da lista ou introduzir uma nova."
						/>
					)}
				/>
			</Grid2>
			<Grid2 size={{ xs: 12 }}>
				{formik.values.typologies.map((typology: TypologyDetailsForm, index: number) => {
					return (
						<Accordion key={'typologyDetails' + index} defaultExpanded={index == 0}>
							<AccordionSummary
								expandIcon={<ExpandMore />}
								aria-controls={`${typology}-content-${index}`}
								id={`${typology}-header-${index}`}>
								<Typography>{typology.typology}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Grid2 container rowSpacing={4} columnSpacing={4}>
									<Grid2 size={{ xs: 6 }}>
										<TextField
											id="bedroomNumber"
											name={`typologies[${index}].bedroomNumber`}
											label={'Número de quartos'}
											value={formik.values.typologies.at(index)?.bedroomNumber}
											onChange={formik.handleChange}
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.bedroomNumber &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.bedroomNumber)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.bedroomNumber
											}
											fullWidth
										/>
									</Grid2>
									<Grid2 size={{ xs: 6 }}>
										<TextField
											id="bathroomNumber"
											name={`typologies[${index}].bathroomNumber`}
											label={'Número de casas de banho'}
											value={formik.values.typologies.at(index)?.bathroomNumber}
											onChange={formik.handleChange}
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.bathroomNumber &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.bathroomNumber)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.bathroomNumber
											}
											fullWidth
										/>
									</Grid2>
									<Grid2 size={{ xs: 6 }}>
										<TextField
											id="garageNumber"
											name={`typologies[${index}].garageNumber`}
											label={'Garagens'}
											value={formik.values.typologies.at(index)?.garageNumber}
											onChange={formik.handleChange}
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.garageNumber &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.garageNumber)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.garageNumber
											}
											fullWidth
										/>
									</Grid2>
									<Grid2 size={{ xs: 3 }}>
										<TextField
											id="totalLotArea"
											name={`typologies[${index}].totalLotArea`}
											label={'Área Total do Lote'}
											value={formik.values.typologies.at(index)?.totalLotArea}
											onChange={formik.handleChange}
											fullWidth
											slotProps={{
												input: {
													endAdornment: <InputAdornment position="start">{'\u33A1'}</InputAdornment>
												}
											}}
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.totalLotArea &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.totalLotArea)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.totalLotArea
											}
										/>
									</Grid2>
									<Grid2 size={{ xs: 3 }}>
										<TextField
											id="livingArea"
											name={`typologies[${index}].livingArea`}
											label={'Área Útil'}
											value={formik.values.typologies.at(index)?.livingArea}
											onChange={formik.handleChange}
											fullWidth
											slotProps={{
												input: {
													endAdornment: <InputAdornment position="start">{'\u33A1'}</InputAdornment>
												}
											}}
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.livingArea &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.livingArea)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.livingArea
											}
										/>
									</Grid2>
									<Grid2 size={{ xs: 6 }}>
										<TextField
											id="price"
											name={`typologies[${index}].price`}
											label={'Preço'}
											value={formik.values.typologies.at(index)?.price}
											onChange={formik.handleChange}
											fullWidth
											slotProps={{
												input: {
													endAdornment: <InputAdornment position="start">€</InputAdornment>
												}
											}}
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.price &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.price)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.price
											}
										/>
									</Grid2>
									<Grid2 size={{ xs: 3 }}>
										<TextField
											id="lots"
											name={`typologies[${index}].lots`}
											label={'Número de lotes'}
											value={formik.values.typologies.at(index)?.lots}
											onChange={formik.handleChange}
											fullWidth
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.lots &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.lots)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.lots
											}
										/>
									</Grid2>
									<Grid2 size={{ xs: 3 }}>
										<TextField
											id="lots"
											name={`typologies[${index}].assignedLots`}
											label={'Número de lotes Reservados'}
											value={formik.values.typologies.at(index)?.assignedLots}
											onChange={formik.handleChange}
											fullWidth
											error={
												// @ts-ignore
												formik.touched.typologies?.at(index)?.assignedLots &&
												// @ts-ignore
												Boolean(formik.errors.typologies?.at(index)?.assignedLots)
											}
											helperText={
												// @ts-ignore
												formik.errors.typologies?.at(index)?.assignedLots
											}
										/>
									</Grid2>
									<Grid2 size={{ xs: 12 }}>
										<FileUploader
											name={`typologies[${index}].plant`}
											title="Adicionar Planta"
											maxFiles={1}
											files={
												formik.values.typologies.at(index)?.plant
													? ([formik.values.typologies.at(index)?.plant] as AbstractFile[])
													: []
											}
											onChange={(value) => {
												const updatedTypologies = [...formik.values.typologies];
												updatedTypologies[index] = {
													...updatedTypologies[index],
													plant: value[0] || undefined
												};
												formik.setFieldValue('typologies', updatedTypologies);
											}}
										/>
									</Grid2>
								</Grid2>
							</AccordionDetails>
						</Accordion>
					);
				})}
			</Grid2>
		</React.Fragment>
	);
};
