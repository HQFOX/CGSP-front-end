import { ArrowBack, ArrowBackIos, ArrowBackIosNew } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { ReactNode, SetStateAction } from 'react';

export interface VerticalNavigationProps {
  open?: boolean;
  pages?: { id: number; text: string; path: string; icon: ReactNode }[];
  setOpen: (value: SetStateAction<boolean>) => void;
}

const drawerWidth = 240;

export const VerticalNavigation = ({ open, pages, setOpen }: VerticalNavigationProps) => {
  return (
    <Drawer
      variant={'persistent'}
      open={open}
      sx={{
        width: `${drawerWidth}px`,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}>
      <Box sx={{ padding: '10px', display: 'flex', height: '92px', justifyContent: "space-between", alignItems: "center"}}>
        <Typography
          variant={'h5'}
          sx={{ marginTop: 'auto', padding: '5px', verticalAlign: 'bottom' }}>
          Menu
        </Typography>
        <IconButton onClick={() => setOpen(!open)} sx={{height:"40px",width:"40px"}}>
          <ArrowBackIos />
        </IconButton>
      </Box>
      <Divider />
      <nav aria-label="admin page navigation">
        <List>
          {pages &&
            pages.map((page) => (
              <ListItem key={page.id}>
                <Link key={page.id} href={page.path} passHref>
                  <ListItemButton>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    <ListItemText>{page.text}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
        </List>
      </nav>
    </Drawer>
  );
};
