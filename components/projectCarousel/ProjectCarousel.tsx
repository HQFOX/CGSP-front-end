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
import construction0 from '../../public/1/construction/construcao0.jpg';
import construction1 from '../../public/1/construction/construcao1.jpg';
import construction2 from '../../public/1/construction/construcao2.jpg';
import construction3 from '../../public/1/construction/construcao3.jpg';
import construction4 from '../../public/1/construction/construcao4.jpg';
import projection3 from '../../public/1/projection/projeccao3.jpg';
import projection5 from '../../public/1/projection/projeccao5.jpg';
import projection6 from '../../public/1/projection/projeccao6.jpg';
import projection7 from '../../public/1/projection/projeccao7.jpg';
import projection8 from '../../public/1/projection/projeccao8.jpg';
import ProjectModal from '../modals/projectModal/projectModal';
import { Foundation, Fullscreen, PhotoCamera, ViewInAr } from '@mui/icons-material';
import Floorpan from '../../public/noun-floor-plan';

const items: CarouselItem[] = [
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

const construction: CarouselItem[] = [
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

const projection: CarouselItem[] = [
  {
    name: "",
    description: "",
    image: projection3
  },
  {
    name: "",
    description: "",
    image: projection5
  },
  {
    name: "",
    description: "",
    image: projection6
  },
  {
    name: "",
    description: "",
    image: projection7
  },
  {
    name: "",
    description: "",
    image: projection8
  }
]

const plant: CarouselItem[] = [
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

enum CategoryType { "construction", "projection", "plant", "all" }

const ProjectCarousel: React.FC = () => {
  const [category, setCategory] = useState<CategoryType>(CategoryType.projection);
  const [index, setIndex] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] =  useState<boolean>(true);

const handleSetCategory = (category: CategoryType) => {
  setCategory(category);
  setIndex(0);
}

const handleOpenModal = (index: number) => {
  setIndex(index)
  setOpenModal(true)
  setAutoPlay(false)
}

const handleCloseModal = () => {
  setOpenModal(false)
  setAutoPlay(true)
}

const handleCarouselItemChange = (index?: number) => {
  index ? setIndex(index) : setIndex(0);
}


  const carouselItems = (category : CategoryType) => {
    switch(category) {
      case CategoryType.construction : 
        return (construction.map((item, i) => (
        <ProjectCarouselCard key={`${category+i}`} index={`${i}`} item={item} handleOpenModal={() => handleOpenModal(i)} handleCloseModal={handleCloseModal} />
          )
        ))
      case CategoryType.projection : 
        return (projection.map((item, i) => (
        <ProjectCarouselCard key={`${category+i}`} index={`${i}`} item={item} handleOpenModal={() => handleOpenModal(i)} handleCloseModal={handleCloseModal}/>
         )
        ))
      case CategoryType.plant : 
        return (plant.map((item, i) => (
        <ProjectCarouselCard key={`${category+i}`} index={`${i}`} item={item} handleOpenModal={() => handleOpenModal(i)} handleCloseModal={handleCloseModal}/>
        )
        ))
    }
  }

  const getItems = (category: CategoryType): CarouselItem[] => {
    switch(category) {
      case CategoryType.construction : 
        return construction
      case CategoryType.projection : 
        return projection
      case CategoryType.plant : 
        return plant
      default:
        return [] as CarouselItem[];
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
            }}
            index={index}
            onChange={(now?:number, next?) => handleCarouselItemChange(now)}
            autoPlay={autoPlay}
            >
            {carouselItems(category)}
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
            <Button variant="contained" startIcon={<PhotoCamera />}>
              Fotos
            </Button>
            <Button variant={category === CategoryType.projection? "contained" : "outlined"} onClick={() => {handleSetCategory(CategoryType.projection)}} startIcon={<ViewInAr/>}>
              Projeção
            </Button>
            <Button variant={category === CategoryType.plant? "contained" : "outlined"} onClick={() => {handleSetCategory(CategoryType.plant)}} startIcon={<Floorpan />}>
              Planta
            </Button>
            <Button variant={category === CategoryType.construction? "contained" : "outlined"} onClick={() => {handleSetCategory(CategoryType.construction)}} startIcon={<Foundation/>}>
              Construção
            </Button>
            <Button style={{marginLeft: 'auto'}} variant={"outlined"} startIcon={<Fullscreen />} onClick={() => handleOpenModal(index)}>
              Tela Inteira
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <ProjectModal
        open={openModal}
        modalOpen={() => handleOpenModal(index)} 
        modalClose={handleCloseModal} 
        items={getItems(category)} 
        index={index} 
        autoPlay={autoPlay}
        handleCarouselItemChange={handleCarouselItemChange}/>
    </Grid>
  );
};

export default ProjectCarousel;
