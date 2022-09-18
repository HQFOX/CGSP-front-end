import { Button } from '@mui/material';
import React from 'react';
import carousel1 from '../../public/carousel1.jpg';
import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import PropTypes, { InferProps } from 'prop-types';

const items = [
  {
    name: 'Random Name #1',
    description: 'Probably the most random thing you have ever seen!',
    image: carousel1
  },
  {
    name: 'Random Name #2',
    description: 'Hello World!',
    image: carousel2
  },
  {
    name: 'Random Name #3',
    description: 'Hello World!',
    image: carousel3
  }
];

const CarouselCard = ({ index, item }: InferProps<typeof CarouselCard.propTypes>): JSX.Element => {
  return (
    <div
      key={`carousel${index}`}
      style={{
        backgroundImage: `url(${item.image.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100vw',
        height: '70vh',
        display: 'flex'
      }}>
      <div
        style={{
          alignSelf: 'flex-end',
          backgroundColor: 'rgba(0,0,0,.3)',
          width: '100vw',
          height: '22rem'
        }}>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <Button className="CheckButton">Check it out!</Button>
      </div>
    </div>
  );
};

CarouselCard.propTypes = {
  index: PropTypes.string,
  item: PropTypes.object
};

export default CarouselCard;
