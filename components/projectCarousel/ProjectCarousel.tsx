import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CardActions,
  Button
} from '@mui/material';
import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import carousel1 from '../../public/carousel1.jpg';
import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import ProjectCarouselCard from './ProjectCarouselCard';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import construction0 from '../../public/1/construction/construcao0.jpg';
import construction1 from '../../public/1/construction/construcao1.jpg';
import construction2 from '../../public/1/construction/construcao2.jpg';
import construction3 from '../../public/1/construction/construcao3.jpg';
import construction4 from '../../public/1/construction/construcao4.jpg';
import ProjectModal from '../projectModal/projectModal';

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

const construction = [
  {
    name: "",
    description: "",
    image: construction0
  },
  {
    name: "",
    description: "",
    image: construction1
  },
  {
    name: "",
    description: "",
    image: construction2
  },
  {
    name: "",
    description: "",
    image: construction3
  },
  {
    name: "",
    description: "",
    image: construction4
  }
]

const projection = [
  {
    name: "",
    description: "",
    image: construction0
  },
  {
    name: "",
    description: "",
    image: construction1
  },
  {
    name: "",
    description: "",
    image: construction2
  },
  {
    name: "",
    description: "",
    image: construction3
  },
  {
    name: "",
    description: "",
    image: construction4
  }
]

const plant = [
  {
    name: "",
    description: "",
    image: construction1
  },
  {
    name: "",
    description: "",
    image: construction1
  },
  {
    name: "",
    description: "",
    image: construction2
  },
  {
    name: "",
    description: "",
    image: construction3
  },
  {
    name: "",
    description: "",
    image: construction4
  }
]

enum DisplayType { "construction", "projection", "plant", "all" }

const ProjectCarousel: React.FC = () => {
  const [display, setDisplay] = useState<DisplayType>(DisplayType.projection) 
  const [openModal, setOpenModal] = useState<boolean>(false)

  const modalOpen = (currentState: boolean) => {
    setOpenModal(!currentState);
  }


  const carouselItems = (display : DisplayType) => {
    switch(display) {
      case DisplayType.construction : 
        return (construction.map((item, i) => (
        <ProjectCarouselCard key={i} index={`${i}`} item={item} />
          )
        ))
      case DisplayType.projection : 
        return (projection.map((item, i) => (
        <ProjectCarouselCard key={i} index={`${i}`} item={item} />
         )
        ))
      case DisplayType.plant : 
        return (plant.map((item, i) => (
        <ProjectCarouselCard key={i} index={`${i}`} item={item} />
        )
        ))
    }
  }
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
            {carouselItems(display)}
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
            <Button variant={display === DisplayType.projection? "contained" : "outlined"} onClick={() => {setDisplay(DisplayType.projection)}} startIcon={<PhotoCameraIcon />}>
              Projeção
            </Button>
            <Button variant={display === DisplayType.plant? "contained" : "outlined"} onClick={() => {setDisplay(DisplayType.plant)}} startIcon={<PhotoCameraIcon />}>
              Planta
            </Button>
            <Button variant={display === DisplayType.construction? "contained" : "outlined"} onClick={() => {setDisplay(DisplayType.construction)}} startIcon={<PhotoCameraIcon />}>
              Construção
            </Button>
            <Button variant={"outlined"} startIcon={<PhotoCameraIcon />} onClick={() => {modalOpen(openModal)}}>
              Tela Inteira
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <ProjectModal open={openModal} modalOpen={modalOpen}/>
    </Grid>
  );
};

export default ProjectCarousel;
