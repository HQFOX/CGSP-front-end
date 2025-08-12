import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

import { AccountCircle, ArrowForwardIos, Logout } from '@mui/icons-material';
import { AppBar, Container, IconButton, Toolbar, Typography, styled } from '@mui/material';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { AuthContext } from '../../AuthContext';
import { LogOutModal } from '../../modals/LogOutModal';

const StyledAppBar = styled(AppBar)(
  ({ theme }) => `
    background-color: ${theme.bg.light}
`
);

export type HeaderProps = {
  admin?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const AdminHeader = ({ setOpen }: HeaderProps) => {
  const router = useRouter();

  const { user: currentUser, setUser: setCurrentUser } = useContext(AuthContext);

  const [logOutModal, setLogOutModal] = useState(false);

  const handleClose = (confirm: boolean) => {
    setLogOutModal(false);
    if (confirm) {
      Cookies.remove('cgsptoken');
      setCurrentUser();
      router.push('/');
    }
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton onClick={() => setOpen(true)} sx={{ height: '40px', width: '40px' }}>
            <ArrowForwardIos />
          </IconButton>
          <Typography sx={{ marginLeft: 'auto' }} color={'GrayText'}>
            {currentUser?.username}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <AccountCircle />
          </IconButton>
          <IconButton
            size="large"
            aria-label="logout"
            aria-haspopup="true"
            onClick={() => setLogOutModal(true)}
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </Container>
      <LogOutModal open={logOutModal} handleClose={(confirm) => handleClose(confirm)} />
    </StyledAppBar>
  );
};

export default AdminHeader;
