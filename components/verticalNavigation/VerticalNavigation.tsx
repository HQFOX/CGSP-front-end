import React, { SetStateAction, useId } from 'react';

import { ArrowBackIosNew } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  ListItemButton,
  Typography,
  styled
} from '@mui/material';

import theme from '../../theme';
import { PageItem, TreeList } from '../TreeList/TreeList';

export interface VerticalNavigationProps {
  open?: boolean;
  pages?: PageItem[];
  setOpen: (value: SetStateAction<boolean>) => void;
}

const drawerWidth = 240;

export const StyledListItemButton = styled(ListItemButton)({
  ':hover': {
    backgroundColor: '#FF7F514D'
  }
});

export const VerticalNavigation = ({ open, pages, setOpen }: VerticalNavigationProps) => {
  return (
    <Drawer
      variant={'temporary'}
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        width: `${drawerWidth}px`,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          backgroundColor: theme.bg.main,
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
    >
      <Box
        sx={{
          padding: '10px',
          display: 'flex',
          height: '92px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography
          variant={'h5'}
          sx={{ marginTop: 'auto', padding: '5px', verticalAlign: 'bottom' }}
        >
          Menu
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          <ArrowBackIosNew />
        </IconButton>
      </Box>
      <Divider />
      <TreeList pages={pages ?? []} />
    </Drawer>
  );
};
