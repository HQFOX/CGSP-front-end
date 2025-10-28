import React, { ReactElement, useState } from 'react';

import { LatLngTuple } from 'leaflet';
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
import {
	Avatar,
	Box,
	CardContent,
	CardHeader,
	Divider,
	Grid2 as Grid,
	IconButton,
	Snackbar,
	SxProps,
	Typography,
	styled
} from '@mui/material';
import { TelegramLogo, X } from '@phosphor-icons/react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import { Hero } from '../components';
import { StyledButton } from '../components/Button';
import { StyledCard } from '../components/StyledCard';
import { Title } from '../components/Title';
import logo from '../public/logo.svg';
import { styles as styles2 } from '../styles/homepage';
import theme from '../theme';

const Map = dynamic(() => import('../components/map/Map'), {
	ssr: false
});

const StyledMain = styled('main')({
	backgroundColor: 'white'
});

const CGSPcenterCoordinates: LatLngTuple = [38.56633674453089, -7.925327404275489];

const HoverCard = ({
	title,
	color,
	icon,
	children
}: {
	title: ReactElement;
	color: string;
	icon: ReactElement;
	children: ReactElement;
}) => {
	const [hovered, setHovered] = useState(false);

	const handleMouseEnter = () => setHovered(true);
	const handleMouseLeave = () => setHovered(false);

	return (
		<StyledCard onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} variant="outlined">
			<CardHeader
				title={<Title component={'span'}>{title}</Title>}
				avatar={
					<Avatar
						sx={{
							color: hovered ? 'white' : color,
							bgcolor: hovered ? color : 'white',
							transition: '0.3s',
							boxShadow: '0 5px 8px 0 rgba(0,0,0,.09)'
						}}>
						{icon}
					</Avatar>
				}
			/>
			{children}
		</StyledCard>
	);
};

const HomeSection = ({
	color,
	sx,
	children
}: {
	color?: string;
	sx?: SxProps;
	children: React.ReactElement[] | React.ReactElement;
}) => {
	return (
		<Box sx={{ backgroundColor: color, pt: 8, pb: 8, ...sx }}>
			<Box
				sx={(theme) => ({
					[theme.breakpoints.up('md')]: {
						paddingLeft: theme.spacing(15),
						paddingRight: theme.spacing(15)
					},
					[theme.breakpoints.down('md')]: {
						paddingLeft: theme.spacing(5),
						paddingRight: theme.spacing(15)
					},
					pt: 6,
					pb: 6
				})}>
				{children}
			</Box>
		</Box>
	);
};

const Home: NextPage<{ updates: Update[] }> = () => {
	const [openSnackbar, setOpenSnackbar] = useState(true);
	const { t } = useTranslation(['homepage', 'common']);

	const handleCloseSnackbar = () => {
		setOpenSnackbar(false);
	};

	const action = (
		<IconButton aria-label="close" onClick={handleCloseSnackbar}>
			<X size={32} color="white" />
		</IconButton>
	);

	const message = (
		<div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
			<Link href="/updates#post-502" passHref>
				<Typography style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
					<TelegramLogo size={32} style={{ margin: 5 }} />
					<span>Resposta à Vereadora Florbela Fernandes</span>
				</Typography>
			</Link>
			{action}
		</div>
	);
	return (
		<StyledMain>
			<Snackbar
				open={openSnackbar}
				onClose={handleCloseSnackbar}
				autoHideDuration={9000}
				message={message}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
				slotProps={{ content: { style: { background: theme.palette.primary.dark } } }}
			/>
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
					<Map
						zoom={13}
						centerCoordinates={CGSPcenterCoordinates}
						markers={[CGSPcenterCoordinates]}
						popupContent={
							<Link
								target="_blank"
								href={`https://www.google.com/maps/search/?api=1&query=${CGSPcenterCoordinates[0]}%2C${CGSPcenterCoordinates[1]}`}
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
