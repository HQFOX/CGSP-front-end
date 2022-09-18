import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Button, Container, styled } from '@mui/material';
import carousel1 from '../../public/carousel1.jpg';
import carousel2 from '../../public/carousel2.jpg';
import carousel3 from '../../public/carousel3.jpg';
import Image from 'next/image';
import { width } from '@mui/system';

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

const CGSPCarousel = () => {
  return (
    <Carousel
      fullHeightHover
      indicatorContainerProps={{
        style: {
          marginTop: '1em'
        }
      }}>
      {items.map((item, i) => (
        <div
          key={`carousel${i}`}
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
      ))}
    </Carousel>
  );
};

export default CGSPCarousel;
