import { Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import logo from '../../../public/logowhite.svg';
import Image from 'next/image';

import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.light,
  padding: theme.spacing(2)
}));

const StyledItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    textAlign: 'center'
  }
}));

const Footer = () => {
  const { t } = useTranslation('footer');

  return (
    <StyledFooter>
      <Grid container spacing={2}>
        <StyledItem item xs={12} md={4}>
          <a href="https://www.facebook.com/profile.php/?id=100008109739037">
            <FacebookIcon fontSize="large" />
          </a>
          <Typography variant="subtitle1">{t('supportEntities')}:</Typography>
          <Typography variant="subtitle1">
            Instituto da Habitação e da Reabilitação Urbana - IHRU
          </Typography>
          <Typography variant="subtitle1">Câmara Municipal de Évora - CME</Typography>
        </StyledItem>
        <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
          <Image src={logo} alt="logo" width={150} height={50} />
        </Grid>
        <StyledItem item xs={12} md={4} textAlign="right">
          <Typography variant="h5">{t('contactsTitle')}:</Typography>
          <Typography variant="subtitle1">
            {t('address')}: Évora B. Malagueira R. do Sarrabulho 4{' '}
          </Typography>
          <Typography variant="subtitle1">{t('telephone')}: 266737970, 963022787</Typography>
          <Typography variant="subtitle1">{t('email')}: cchegiraldo@mail.telepac.pt</Typography>
        </StyledItem>
      </Grid>
    </StyledFooter>
  );
};

export default Footer;
