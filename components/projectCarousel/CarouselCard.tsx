import {
  Button,
  Box,
  Typography,
  styled,
  Card,
  CardActionArea,
  CardHeader,
  Grid,
  CardContent,
  CardMedia
} from '@mui/material';
import React from 'react';
import Image from 'next/image';

const ProjectCarouselCard = ({ index, item }: CarouselCardProps) => {
  return (
    <CardMedia>
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src={item.image}
          objectFit="contain" // or objectFit="cover"
          //   height={'600px'}
        />
      </div>
    </CardMedia>
  );
};

const CarouselCardText = styled('div')(
  ({ theme }) => `
  background-color:rgba(0,0,0,.3);
  align-self: end;
  width: 100vw;
  ${theme.breakpoints.down('md')} {  
    padding: ${theme.spacing(2)};
    height: 12rem;
  }
  ${theme.breakpoints.up('md')} {
    padding: ${theme.spacing(8)};
    height: 22rem;
  }
`
);

type CarouselCardProps = {
  index: string;
  item: CarouselItem;
};

export default ProjectCarouselCard;
