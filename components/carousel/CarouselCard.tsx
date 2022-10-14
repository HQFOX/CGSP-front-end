import { Button, Box, Typography, styled } from '@mui/material';
import React from 'react';

const CarouselCard = ({ index, item }: CarouselCardProps) => {
  return (
    <Box
      key={`carousel${index}`}
      sx={{
        backgroundImage: `url(${item.image.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: { xs: 'cover', md: 'auto' },
        width: '100vw',
        height: '70vh',
        display: 'flex'
      }}>
      <CarouselCardText>
        <Typography variant="h4" component="h1" color="common.white">
          {item.name}
        </Typography>
        <Typography variant="subtitle1" component="h2" color="common.white">
          {item.description}
        </Typography>
        <Button className="CheckButton">Check it out!</Button>
      </CarouselCardText>
    </Box>
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

export default CarouselCard;
