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
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../../../public/logo.svg';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowForward, ArrowForwardIos } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)(
  ({ theme }) => `
    background-color: ${theme.bg.main}
`
);

export type HeaderProps = {
  admin?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const Header = ({ admin = false, setOpen }: HeaderProps) => {
  const { t } = useTranslation('header');
  const router = useRouter();

  const locales = router.locales;

  const [language, setLanguage] = useState(router.locale);

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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (locale: string | void) => {
    setAnchorEl(null);
    if (locale) router.push(router.asPath, undefined, { locale: locale });
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {admin ? (
            <IconButton onClick={() => setOpen(true)} sx={{ height: '40px', width: '40px' }}>
              <ArrowForwardIos />
            </IconButton>
          ) : (
            <></>
          )}
          <Box
            component="a"
            href="/"
            sx={{
              mr: 2,
              p: 2,
              display: { xs: 'none', md: 'flex' }
            }}>
            <Image src={logo} alt="logo" width={180} height={60} />
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
            <Image src={logo} alt="logo" width={120} height={40} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Button
              id="languageDropdown"
              aria-haspopup="true"
              onClick={handleClick}
              endIcon={<ExpandMoreIcon />}
              variant="outlined"
              size="small">
              {language?.toUpperCase()}
            </Button>
            <Menu
              id="languageDropdown-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleClose()}
              MenuListProps={{
                'aria-labelledby': 'languageDropdown'
              }}>
              {locales?.map((locale, index) => (
                <MenuItem key={index} onClick={() => handleClose(locale)}>
                  {t(`languages.${locale}`)}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page.id} href={page.path} passHref>
                <Button sx={{ p: 4, display: 'block' }}>{page.headerText.toUpperCase()}</Button>
              </Link>
            ))}
            <Box m="auto" sx={{ mr: 0 }}>
              <Button
                id="languageDropdown"
                aria-haspopup="true"
                onClick={handleClick}
                endIcon={<ExpandMoreIcon />}
                variant="outlined"
                sx={{ maxHeight: 40 }}>
                {t(`languages.${language}`)}
              </Button>
              <Menu
                id="languageDropdown-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                MenuListProps={{
                  'aria-labelledby': 'languageDropdown'
                }}>
                {locales?.map((locale, index) => (
                  <MenuItem key={index} onClick={() => handleClose(locale)}>
                    {t(`languages.${locale}`)}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
