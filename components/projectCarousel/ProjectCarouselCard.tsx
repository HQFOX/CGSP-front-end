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

const ProjectCarouselCard = ({ index, item, handleOpenModal, handleCloseModal }: CarouselCardProps) => {
  return (
    <CardMedia>
      <div style={{ height: 500, overflow: 'hidden' }}>
        <Image
          src={item.image}
          objectFit="cover" // or objectFit="cover"
          // height={600}
          onClick={handleOpenModal}
        />
      </div>
    </CardMedia>
  );
};

type CarouselCardProps = {
  index: string;
  item: CarouselItem;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
};

export default ProjectCarouselCard;
