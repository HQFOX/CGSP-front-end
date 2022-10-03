import { Typography, Paper, Box, Divider } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import example from '../../public/carousel1.jpg';

const width = '40vw';

// eslint-disable-next-line react/prop-types
const UpdateCard = ({ post }: any) => {
  return (
    <Paper
      sx={(theme) => ({
        [theme.breakpoints.up('md')]: { width: width },
        [theme.breakpoints.down('md')]: { width: '90vw' }
      })}
      elevation={4}>
      <Box sx={{ p: 4 }}>
        <Typography variant={'h5'}>{post.title}</Typography>
        <Divider sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
          30 de Setembro de 2022
        </Typography>
      </Box>
      <Box sx={{ width: 1 }}>
        <Image src={example} />
      </Box>
      <Box sx={{ p: 4 }}>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </Box>
    </Paper>
  );
};

export default UpdateCard;
