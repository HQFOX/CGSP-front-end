import React from 'react';

import { CardMedia } from '@mui/material';
import Image from 'next/image';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProjectCarouselCard = ({ index, item, handleShowModal }: CarouselCardProps) => {
  return (
    <CardMedia>
      <div style={{ height: 700, overflow: 'hidden' }}>
        <Image
          alt=""
          src={item}
          fill={true}
          style={{ objectFit: 'cover' }}
          onClick={() => handleShowModal(index)}
        />
      </div>
    </CardMedia>
  );
};

export interface CarouselCardProps {
  index: number;
  item: string;
  handleShowModal: (index: number) => void;
}

export default ProjectCarouselCard;
