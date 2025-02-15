/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Carousel from 'react-material-ui-carousel';

import { Close } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Dialog, IconButton } from '@mui/material';
import Image from 'next/image';

import { StyledIconButton } from './projectModal.styles';

type ProjectModalProps = {
  open: boolean;
  modalOpen: () => void;
  modalClose: () => void;
  files: ProjectFile[];
  index: number;
  autoPlay: boolean;
  handleCarouselItemChange: (index?: number) => void;
};

const ProjectModal = ({
  open,
  modalOpen,
  modalClose,
  files,
  index,
  autoPlay,
  handleCarouselItemChange
}: ProjectModalProps) => {
  return (
    <Dialog fullScreen open={open} onClose={modalClose} sx={{ p: 2, display: 'block' }}>
      <IconButton
        aria-label="close"
        onClick={modalClose}
        sx={{
          ml: 'auto',
          mt: 1,
          mr: 2
        }}
      >
        <Close />
      </IconButton>
      <Carousel
        sx={{ marginTop: 2 }}
        autoPlay={autoPlay}
        fullHeightHover
        navButtonsAlwaysVisible
        index={index}
        onChange={(now?: number, next?) => handleCarouselItemChange(now)}
      >
        {files.map((file) => (
          <div key={index} style={{ height: '100dvh' }}>
            <Image
              key={index}
              alt=""
              src={`${process.env.NEXT_PUBLIC_S3_URL}${file.filename}`}
              fill={true}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </Carousel>
    </Dialog>
  );
};

export default ProjectModal;
