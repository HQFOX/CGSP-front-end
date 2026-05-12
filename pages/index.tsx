import React from 'react';

import type { LatLngTuple } from 'leaflet';
import type { NextPage } from 'next';

import {
	Architecture,
	BookmarkAdd,
	Construction,
	Description,
	Group,
	MeetingRoom,
	OpenInNew,
	PersonAdd,
	Savings
} from '@mui/icons-material';
import { Box, CardContent, Divider, Grid2 as Grid, Typography, styled } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';

import { Hero, HomeSection, HoverCard, StyledButton, Title } from '../components';
import { DynamicMap } from '../components/map/DynamicMap';
import logo from '../public/logo.svg';
import { styles as styles2 } from '../styles/homepage';
import theme from '../theme';

const StyledMain = styled('main')({
	backgroundColor: 'white'
});

const CGSPCenterCoordinates: LatLngTuple = [38.56633674453089, -7.925327404275489];

const Home: NextPage<{ updates: Update[] }> = () => {
	const { t } = useTranslation(['homepage', 'common']);

	return (
		<StyledMain>
			<Hero />
			<HomeSection color="rgb(249, 249, 249)" sx={{ pt: undefined, mt: 8 }}>
				<Box sx={{ pb: 4, textIndent: 35 }} id="aboutus">
					<Title variant="h4" component="h1" fontSize={24}>
						{t('ourMissionTitle')}
					</Title>
					<Divider sx={{ mb: 4 }} />
					<Typography variant="body2" color="text.secondary">
						{t('ourMissionTextP1')}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{t('ourMissionTextP2')}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{t('ourMissionTextP3')}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{t('ourMissionTextP4')}
					</Typography>
					<div className={styles2.logoContainer}>
						<Image src={logo} alt="Cooperativa Giraldo Sem Pavor logo" width={200} height={60} />
					</div>
				</Box>
			</HomeSection>
			<HomeSection color={theme.palette.secondary.light}>
				<Box sx={{ pb: 4 }}>
					<Title variant="h4" component="h1" fontSize={24}>
						{t('howDoesItWorkTitle')}
					</Title>
					<Divider />
				</Box>
				<Grid container spacing={2}>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('projectElaborationTitle')}</Title>}
							icon={<Architecture color="inherit" fontSize="large" />}
							color={theme.palette.success.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('projectElaborationText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('inscriptionTitle')}</Title>}
							icon={<PersonAdd color="inherit" fontSize="large" />}
							color={theme.palette.success.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('inscriptionText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('reservationTitle')}</Title>}
							icon={<BookmarkAdd color="inherit" fontSize="large" />}
							color={theme.palette.success.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('reservationText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('constructionTitle')}</Title>}
							icon={<Construction color="inherit" fontSize="large" />}
							color={theme.palette.success.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('projectElaborationText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection color={'white'}>
				<Box sx={{ pb: 4 }}>
					<Title variant="h4" component="h1" fontSize={24}>
						{t('advantagesTitle')}
					</Title>
					<Divider />
				</Box>
				<Grid container columnSpacing={2}>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('controlledCostsTitle')}</Title>}
							icon={<Savings color="inherit" fontSize="large" />}
							color={theme.palette.primary.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('controlledCostsText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('transparencyTitle')}</Title>}
							icon={<MeetingRoom color="inherit" fontSize="large" />}
							color={theme.palette.primary.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('transparencyText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('bureaucracyTitle')}</Title>}
							icon={<Description color="inherit" fontSize="large" />}
							color={theme.palette.primary.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('bureaucracyText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
					<Grid size={{ xs: 12, sm: 6, md: 3 }}>
						<HoverCard
							title={<Title>{t('middlemanTitle')}</Title>}
							icon={<Group color="inherit" fontSize="large" />}
							color={theme.palette.primary.main}>
							<CardContent>
								<Typography variant="body2" color="text.secondary">
									{t('middlemanText')}
								</Typography>
							</CardContent>
						</HoverCard>
					</Grid>
				</Grid>
			</HomeSection>
			<HomeSection color="rgb(249, 249, 249)">
				<Box sx={{ pb: 4 }} id="howitstarted">
					<Title variant="h4" component="h1" fontSize={24}>
						{t('howItStartedTitle')}
					</Title>
					<Divider sx={{ mb: 4 }} />
					<Box sx={{ textIndent: 35, pb: 2 }}>
						<Typography variant="body2" color="text.secondary">
							{t('howItStartedTextP1')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('howItStartedTextP2')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('howItStartedTextP3')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('howItStartedTextP4')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('howItStartedTextP5')}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('howItStartedTextP6')}
						</Typography>
					</Box>
					<Link href="/history" passHref>
						<StyledButton variant={'contained'} disableElevation>
							Ver Histórico de Projetos
						</StyledButton>
					</Link>
				</Box>
			</HomeSection>
			<HomeSection>
				<Title variant="h5" component="h1" fontSize={24}>
					{t('howToGetThere')}:
				</Title>
				<Divider />
				<Box id="map" className={styles2.mapContainer} sx={{ pt: 2 }}>
					<DynamicMap
						zoom={13}
						centerCoordinates={CGSPCenterCoordinates}
						markers={[CGSPCenterCoordinates]}
						popupContent={
							<Link
								target="_blank"
								href={`https://www.google.com/maps/search/?api=1&query=${CGSPCenterCoordinates[0]}%2C${CGSPCenterCoordinates[1]}`}
								passHref>
								<StyledButton endIcon={<OpenInNew />}>Ver No Google Maps</StyledButton>
							</Link>
						}
					/>
				</Box>
			</HomeSection>
		</StyledMain>
	);
};
export const getServerSideProps = async (ctx: any) => {
	const res = fetch(`${process.env.API_URL}/update`).then((res) => {
		if (res.ok) {
			return res.json().then((data) => data);
		}
		console.error('Error fetching updates');
	});

	const updates = (await res) ?? [];
	return {
		props: {
			updates,
			...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header', 'homepage']))
		}
	};
};

export default Home;
