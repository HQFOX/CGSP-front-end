import React, { ReactNode, useState } from 'react';

import { useFormik } from 'formik';
import type { LatLngTuple } from 'leaflet';

import { OpenInNew } from '@mui/icons-material';
import { Autocomplete, Grid2, TextField, Typography } from '@mui/material';
import Link from 'next/link';

import { DynamicMap, Loading, StyledButton } from '../..';
import { styles } from './styles';

export const districtList = ['Évora', 'Beja', 'Portalegre', 'Setúbal', 'Aveiro', 'Braga'];

interface LocationSectionProps {
	formik: ReturnType<typeof useFormik<any>>;
	centerCoordinates: LatLngTuple;
	onCoordinateChange: ({
		values,
		district,
		county
	}: {
		values: LatLngTuple;
		district?: string;
		county?: string;
	}) => Promise<void>;
	handleDistrictChange: (district: string | null) => void;
}

export const LocationSection = ({
	formik,
	centerCoordinates,
	onCoordinateChange,
	handleDistrictChange
}: LocationSectionProps) => {
	const [loading, setLoading] = useState(false);

	const handleOnCoordinateChange = async (values: LatLngTuple) => {
		setLoading(true);
		try {
			const geoApiInfo = await fetch(`https://json.geoapi.pt/gps/${values[0]},${values[1]}`).then(
				(res) => (res.ok ? res.json() : undefined)
			);

			onCoordinateChange({ values, district: geoApiInfo?.distrito, county: geoApiInfo?.concelho });
		} finally {
			setLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant={'h6'}>Localização</Typography>
			</Grid2>
			<Grid2 size={{ xs: 3 }}>
				<Autocomplete
					id="district"
					freeSolo
					options={districtList}
					value={formik.values.district}
					onChange={(_e, value) => handleDistrictChange(value)}
					onInputChange={(_e, value, reason) => {
						if (reason === 'input' || reason === 'clear') {
							handleDistrictChange(value);
						}
					}}
					fullWidth
					renderInput={(params) => (
						<TextField
							{...params}
							label={'Distrito'}
							error={formik.touched.district && Boolean(formik.errors.district)}
							helperText={formik.touched.district && (formik.errors.district as ReactNode)}
						/>
					)}
				/>
			</Grid2>
			<Grid2 size={{ xs: 3 }}>
				<TextField
					id="county"
					name="county"
					label={'Concelho'}
					value={formik.values.county}
					onChange={formik.handleChange}
					error={formik.touched.county && Boolean(formik.errors.county)}
					helperText={formik.touched.county && (formik.errors.county as ReactNode)}
					fullWidth
				/>
			</Grid2>
			<Grid2 size={{ xs: 3 }}>
				<TextField
					id="latitude"
					name="latitude"
					label={'latitude'}
					value={formik.values.latitude}
					onChange={formik.handleChange}
					error={formik.touched.latitude && Boolean(formik.errors.latitude)}
					helperText={formik.touched.latitude && (formik.errors.latitude as ReactNode)}
					fullWidth
				/>
			</Grid2>
			<Grid2 size={{ xs: 3 }}>
				<TextField
					id="longitude"
					name="longitude"
					label={'longitude'}
					value={formik.values.longitude}
					onChange={formik.handleChange}
					error={formik.touched.longitude && Boolean(formik.errors.longitude)}
					helperText={formik.touched.longitude && (formik.errors.longitude as ReactNode)}
					fullWidth
				/>
			</Grid2>
			<Grid2 size={{ xs: 12 }}>
				<Typography variant="body2">
					Arraste o Marcador ou clique duas vezes no mapa para preencher automaticamente.
				</Typography>
				<div id="map" className={styles.mapContainer}>
					{loading && (
						<div className={styles.mapLoadingOverlay}>
							<Loading />
						</div>
					)}
					<DynamicMap
						doubleClickZoom={false}
						scrollWheelZoom={true}
						centerCoordinates={centerCoordinates}
						markers={
							formik.values.latitude && formik.values.longitude
								? [[formik.values.latitude, formik.values.longitude]]
								: []
						}
						onCoordinateChange={handleOnCoordinateChange}
						changeView
						draggable
						zoom={13}
						popupContent={
							<Link
								target="_blank"
								href={`https://www.google.com/maps/search/?api=1&query=${formik.values.latitude}%2C${formik.values.longitude}`}
								passHref>
								<StyledButton endIcon={<OpenInNew />}>Ver No Google Maps</StyledButton>
							</Link>
						}
					/>
				</div>
			</Grid2>
		</React.Fragment>
	);
};
