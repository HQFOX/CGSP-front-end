import React from 'react';
import Carousel from 'react-material-ui-carousel';

import { CardContent, Grid, Typography } from '@mui/material';
import Link from 'next/link';

import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import construcao3 from '../../public/construcao3.jpg';
import projeccao0R from '../../public/projeccao0R.jpg';
import theme from '../../theme';
import { StyledButton } from '../Button';
import { Title } from '../Title';

const items = [
  {
    name: 'Giraldo Sem Pavor Cooperativa de Construção e Habitação',
    description: 'A desenhar e construir habitações para os seus sócios há mais de 40 anos.',
    action: (
      <Link href="/#aboutus" passHref>
        <StyledButton variant="outlined" color={'secondary'}>
          Sobre nós
        </StyledButton>
      </Link>
    ),
    image: projeccao0R
  },
  {
    name: 'Atualizações',
    description: 'Veja aqui as atualizações mais recentes sobre nós e os nossos projetos.',
    action: (
      <Link href="/updates" passHref>
        <StyledButton variant="outlined" color={'secondary'}>
          Atualizações
        </StyledButton>
      </Link>
    ),
    image: construcao3
  },
  {
    name: 'LOTEAMENTO MOINHO I - ÉVORA',
    description: 'Veja aqui os detalhes sobre o nosso projeto mais recente.',
    action: (
      <Link href="/projects" passHref>
        <StyledButton variant="outlined" color={'secondary'}>
          Detalhes do Projeto
        </StyledButton>
      </Link>
    ),
    image: carousel2
  },
  {
    name: 'Histórico',
    description: 'Saiba mais detalhes sobre projetos concluídos da nossa cooperativa.',
    action: (
      <Link href="/history" passHref>
        <StyledButton variant="outlined" color={'secondary'}>
          Projetos Concluídos
        </StyledButton>
      </Link>
    ),
    image: carousel3
  }
];

const CGSPCarousel: React.FC = () => {
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
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          style={{ backgroundColor: theme.palette.primary.dark, alignContent: 'center' }}
        >
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
          item
          xs={12}
          md={6}
          lg={8}
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
          item
          xs={12}
          md={6}
          lg={8}
          sx={{
            backgroundImage: `url(${items[1].image.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: { xs: 'cover', md: 'cover' }
          }}
        ></Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          style={{ backgroundColor: theme.palette.primary.dark, alignContent: 'center' }}
        >
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
          item
          xs={12}
          md={6}
          lg={8}
          sx={{
            backgroundImage: `url(${items[3].image.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: { xs: 'cover', md: 'cover' }
          }}
        ></Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={4}
          style={{ backgroundColor: theme.palette.primary.dark, alignContent: 'center' }}
        >
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
