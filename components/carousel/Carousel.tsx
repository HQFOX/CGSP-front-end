import React from 'react';
import Carousel from 'react-material-ui-carousel';

import { CardContent, Grid2 as Grid, Grid2Props, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { StyledButton, Title } from '..';
import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import construcao3 from '../../public/construcao3.jpg';
import projeccao0R from '../../public/projeccao0R.jpg';
import theme from '../../theme';

const CGSPCarousel: React.FC = () => {
  const { t } = useTranslation(['homepage', 'header']);

  const items = [
    {
      name: 'Giraldo Sem Pavor Cooperativa de Construção e Habitação',
      description: t('carousel.sinceText'),
      action: (
        <Link href="/#aboutus" passHref>
          <StyledButton variant="outlined" color={'secondary'}>
            {t('carousel.aboutUs')}
          </StyledButton>
        </Link>
      ),
      image: projeccao0R
    },
    {
      name: t('header:updates'),
      description: t('carousel.updatesText'),
      action: (
        <Link href="/updates" passHref>
          <StyledButton variant="outlined" color={'secondary'}>
            {t('header:updates')}
          </StyledButton>
        </Link>
      ),
      image: construcao3
    },
    {
      name: 'LOTEAMENTO MOINHO I - ÉVORA',
      description: t('carousel.historyText'),
      action: (
        <Link href="/projects" passHref>
          <StyledButton variant="outlined" color={'secondary'}>
            {t('header:history')}
          </StyledButton>
        </Link>
      ),
      image: carousel2
    },
    {
      name: t('header:history'),
      description: t('carousel.historyText'),
      action: (
        <Link href="/history" passHref>
          <StyledButton variant="outlined" color={'secondary'}>
            {t('header:history')}
          </StyledButton>
        </Link>
      ),
      image: carousel3
    }
  ];

  const gridItemImageSectionProps: Grid2Props = { size: { xs: 12, md: 6, lg: 8 } };

  const gridItemTectSectionProps: Grid2Props = {
    size: { xs: 12, md: 6, lg: 4 },
    style: { backgroundColor: theme.palette.primary.dark, alignContent: 'center' }
  };

  return (
    <Carousel
      fullHeightHover
      indicatorContainerProps={{
        style: {
          marginTop: '1em'
        }
      }}
      autoPlay={false}
      activeIndicatorIconButtonProps={{
        style: {
          color: theme.palette.primary.main
        }
      }}
      height={'70dvh'}
    >
      <Grid
        container
        spacing={0}
        key={'carousel1'}
        style={{ backgroundColor: theme.palette.primary.dark }}
        height={'100%'}
      >
        <Grid {...gridItemTectSectionProps}>
          <CardContent sx={{ p: { xs: 2, lg: 8 } }}>
            <Title variant="h1" component="h1" fontSize={44} color={'white'}>
              Giraldo Sem Pavor
            </Title>
            <Title variant="h2" component="h1" paddingBottom={3} fontSize={30} color={'white'}>
              {'Cooperativa de Construção \n e Habitação'}
            </Title>
            <Typography variant="subtitle1" component="h2" paddingBottom={2} color={'white'}>
              {items[0].description}
            </Typography>
            {items[0].action}
          </CardContent>
        </Grid>
        <Grid
          {...gridItemImageSectionProps}
          sx={{
            backgroundImage: `url(${items[0].image.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: { xs: 'cover', md: 'auto' }
          }}
        ></Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        key={'carousel2'}
        style={{ backgroundColor: theme.palette.primary.dark }}
        height={'100%'}
      >
        <Grid
          {...gridItemImageSectionProps}
          sx={{
            backgroundImage: `url(${items[1].image.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: { xs: 'cover', md: 'cover' }
          }}
        ></Grid>
        <Grid {...gridItemTectSectionProps}>
          <CardContent sx={{ p: { xs: 2, lg: 8 } }}>
            <Title variant="h1" component="h1" fontSize={33} color={'white'}>
              {items[1].name}
            </Title>
            <Typography variant="subtitle1" component="h2" paddingBottom={2} color={'white'}>
              {items[1].description}
            </Typography>
            {items[1].action}
          </CardContent>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        key={'carousel3'}
        style={{ backgroundColor: theme.palette.primary.dark }}
        height={'100%'}
      >
        <Grid
          {...gridItemImageSectionProps}
          sx={{
            backgroundImage: `url(${items[3].image.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: { xs: 'cover', md: 'cover' }
          }}
        ></Grid>
        <Grid {...gridItemTectSectionProps}>
          <CardContent sx={{ p: { xs: 2, lg: 8 } }}>
            <Title variant="h1" component="h1" fontSize={33} color={'white'}>
              {items[3].name}
            </Title>
            <Typography variant="subtitle1" component="h2" paddingBottom={2} color={'white'}>
              {items[3].description}
            </Typography>
            {items[3].action}
          </CardContent>
        </Grid>
      </Grid>
    </Carousel>
  );
};

export default CGSPCarousel;
