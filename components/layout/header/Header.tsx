import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const StyledAppBar = styled(AppBar)(
  ({ theme }) => `
    background-color: ${theme.bg.main}
`
);

const Header = () => {
  const { t } = useTranslation('header');

  const pages = [
    {
      id: 1,
      headerText: t('home'),
      path: '/'
    },
    {
      id: 2,
      headerText: t('projects'),
      path: '/projects'
    },
    {
      id: 3,
      headerText: t('history'),
      path: '/history'
    },
    {
      id: 4,
      headerText: t('updates'),
      path: '/updates'
    },
    {
      id: 5,
      headerText: t('faq'),
      path: '/faq'
    }
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' }
            }}>
            <Image src={logo} alt="logo" width={150} height={50} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}>
              {pages.map((page) => (
                <MenuItem key={page.headerText} onClick={handleCloseNavMenu}>
                  <Box textAlign="center">{page.headerText}</Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1
            }}>
            <Image src={logo} alt="logo" width={100} height={30} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.id} href={page.path}>
                <Button key={page.id} onClick={handleCloseNavMenu} sx={{ my: 2, display: 'block' }}>
                  {page.headerText}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
