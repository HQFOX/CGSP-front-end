import { Stack } from '@mui/material';
import React from 'react';
import UpdateCard from './UpdateCard';

const updates: Update[] = [
  {
    title: 'APARTAMENTOS - BEJA'
  },
  {
    title: 'APARTAMENTOS - BEJA'
  },
  {
    title: 'APARTAMENTOS - BEJA'
  },
  {
    title: 'APARTAMENTOS - BEJA'
  }
];

const Updates: React.FC = () => {
  return (
    <Stack spacing={10} sx={{ pt: 10, pb: 10 }}>
      {updates.map((item, i) => (
        <UpdateCard key={i} post={item} />
      ))}
    </Stack>
  );
};

export default Updates;
