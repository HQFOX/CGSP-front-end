import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Button
} from '@mui/material';
import React from 'react';
import Carousel from 'react-material-ui-carousel';
import carousel1 from '../../public/carousel1.jpg';
import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import ProjectCarouselCard from './CarouselCard';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const items = [
  {
    name: 'Sede da Cooperativa Évora',
    description: 'Probably the most random thing you have ever seen!',
    image: carousel1
  },
  {
    name: 'LOTEAMENTO MOINHO I - ÉVORA',
    description: 'Hello World!',
    image: carousel2
  },
  {
    name: 'LOTEAMENTO CABEÇO DO ARRAIAL - ALMEIRIM - ÉVORA',
    description: 'Hello World!',
    image: carousel3
  }
];

const ProjectCarousel: React.FC = () => {
  return (
    <Grid container justifyContent={'center'}>
      <Grid item>
        <Card sx={{ width: 800, margin: 'auto' }}>
          <Carousel
            fullHeightHover
            indicatorContainerProps={{
              style: {
                marginTop: '1em'
              }
            }}>
            {items.map((item, i) => (
              <ProjectCarouselCard key={i} index={`${i}`} item={item} />
            ))}
          </Carousel>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
              across all continents except Antarctica
            </Typography>
          </CardContent>
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
  );
};

export default ProjectCarousel;
