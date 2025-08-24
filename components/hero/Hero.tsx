import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Box, Grid2, Typography } from '@mui/material';
import NumberFlow from '@number-flow/react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import construcao3 from '../../public/construcao3.jpg';
import theme from '../../theme';
import { StyledButton } from '../Button';
import { Title } from '../Title';
import { GradientBox, ImageBox } from './styles';

const textColor = 'white';

const numberFlowProps = {
	transformTiming: { duration: 200 },
	// Used for the digit spin animations.
	// Will fall back to `transformTiming` if unset:
	spinTiming: { duration: 1250, easing: 'ease-out' },
	// Used for fading in/out characters:
	opacityTiming: { duration: 350, easing: 'ease-out' }
};

export const Hero = () => {
	const { t } = useTranslation(['homepage', 'common']);

	const [totalHousing, setTotalHousing] = useState(0);

	const [totalProjects, setTotalProjects] = useState(0);

	const { ref, inView } = useInView({
		triggerOnce: false,
		threshold: 0,
		delay: 500
	});

	useEffect(() => {
		if (inView) {
			setTotalHousing(590);
			setTotalProjects(12);
		} else {
			setTotalHousing(0);
			setTotalProjects(0);
		}
	}, [inView]);

	return (
		<Grid2
			container
			height={{ xs: '90dvh', md: '80dvh', lg: '70dvh' }}
			style={{ position: 'relative' }}
			color={textColor}>
			<ImageBox
				sx={{
					backgroundImage: `url(${construcao3.src})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: { xs: 'cover', md: 'cover', lg: 'contain', xl: 'contain' }
				}}
			/>
			<GradientBox />
			<Grid2
				size={{ xs: 12 }}
				zIndex={10}
				bgcolor={'transparent'}
				paddingTop={{ xs: 4, md: 8 }}
				paddingLeft={{ xs: 4, md: 8 }}
				ml={{ xs: 'auto', md: 8 }}
				ref={ref}>
				<Title variant="h1" component="h1" fontSize={34}>
					{t('cooperativeName')}
				</Title>
				<Title variant="h2" component="h2" fontSize={26}>
					{t('cooperativeType')}
				</Title>
				<Typography variant="subtitle1" component="h2" paddingBottom={2}>
					{t('hero.sinceText')}
				</Typography>
				<Title variant="h3" component="h3" fontSize={26} paddingTop={4}>
					{t('hero.tagLine')}
				</Title>
				<Title
					variant="h2"
					component="h2"
					fontSize={24}
					style={{ marginLeft: 10 }}
					color={textColor}>
					<Title fontSize={34} component="span" color={theme.palette.secondary.main}>
						<NumberFlow value={totalHousing} {...numberFlowProps} />
					</Title>{' '}
					{t('hero.finishedHousing')}
				</Title>
				<Title variant="h2" component="h2" fontSize={24} style={{ marginLeft: 10 }}>
					<Title fontSize={34} component="span" color={theme.palette.secondary.main}>
						<NumberFlow value={totalProjects} {...numberFlowProps} />
					</Title>{' '}
					{t('hero.finishedProjects')}
				</Title>
			</Grid2>
			<Grid2 offset={{ xs: 1, sm: 4 }} size={{ xs: 12, sm: 6 }} paddingLeft={{ xs: 4, md: 8 }}>
				<Link href="/history" passHref>
					<StyledButton disableElevation variant="outlined" color={'secondary'}>
						{t('hero.ourHistory')}
					</StyledButton>
				</Link>
			</Grid2>
		</Grid2>
	);
};
