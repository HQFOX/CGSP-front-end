import React from 'react';
import Carousel from 'react-material-ui-carousel';
import carousel1 from '../../public/carousel1.jpg';
import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import CarouselCard from './CarouselCard';
import theme from '../../theme';

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

const CGSPCarousel: React.FC = () => {
  return (
    <Carousel
      fullHeightHover
      indicatorContainerProps={{
        style: {
          marginTop: '1em'
        }
      }}
      activeIndicatorIconButtonProps={{
        style: {
            color: theme.palette.primary.main,
          }
      }}
      >
      {items.map((item, i) => (
        <CarouselCard key={i} index={`${i}`} item={item} />
      ))}
    </Carousel>
  );
};

export default CGSPCarousel;
