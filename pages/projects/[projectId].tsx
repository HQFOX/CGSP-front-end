import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import type { GetStaticPaths, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import example from '../../public/1/projeccao/projeccao6.jpg';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useState } from 'react';
import ProjectCarousel from '../../components/projectCarousel/Carousel';

const ProjectDetails: NextPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container component="main" sx={{ pt: 10, pb: 10 }}>
      <Box sx={{ pb: 15 }}>
        <Typography variant="h4" component="h1" textAlign="right">
          Nome do Projeto
        </Typography>
        <Divider />
      </Box>
      <Grid container justifyContent={'center'}>
        <Grid item>
          <Card sx={{ maxWidth: 800, margin: 'auto' }}>
            <CardActionArea>
              <CardMedia component="img" height={400} image={example.src} alt="green iguana" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species,
                  ranging across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button variant="contained" startIcon={<PhotoCameraIcon />}>
                Fotos
              </Button>
              <Button color="primary" startIcon={<PhotoCameraIcon />}>
                Projeção
              </Button>
              <Button color="primary" startIcon={<PhotoCameraIcon />}>
                Planta
              </Button>
              <Button color="primary" startIcon={<PhotoCameraIcon />}>
                Localização
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Grid container justifyContent={'center'}>
        <Grid item style={{ width: '600px' }}>
          <ProjectCarousel />
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Características" />
          <Tab label="Inscrição" />
          <Tab label="Atualizações" />
        </Tabs>
      </Box>
      <Grid container>
        <Grid item md={12}>
          <Typography>Área Interior: 41 m2</Typography>
        </Grid>
        <Grid item md={12}>
          <Typography>Área Exterior: 41 m2</Typography>
        </Grid>
        <Grid item md={12}>
          <Typography>Casas de Banho: 2</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
  }
});

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [
      { params: { projectId: '1' }, locale: 'en' },
      { params: { projectId: '1' }, locale: 'pt' },
      { params: { projectId: '2' } }
    ],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: false
  };
};

export default ProjectDetails;
