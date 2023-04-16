import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import Button from '@mui/material/Button';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CGSPCarousel from '../components/carousel/Carousel';
import { Box, Divider, Typography } from '@mui/material';
import Image from 'next/image';
import logo from '../public/logo.svg';
import Updates from '../components/updates/Update';
import dynamic from 'next/dynamic';
import styled from '@emotion/styled';
import theme from '../theme';
// import { Map } from '../components/map/Map';

const Map = dynamic(() => import('../components/map/Map'), {
  ssr: false
},
)

const StyledMain = styled("main")({
  backgroundColor: theme.bg.main
})




const Home: NextPage = () => {
  const { t, i18n } = useTranslation(['homepage', 'common']);

  return (
    <StyledMain className={styles.container && styles.main}>
      <CGSPCarousel />
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: { padding: theme.spacing(15) },
          [theme.breakpoints.down('md')]: { padding: theme.spacing(5) }
        })}>
        <Typography variant="h4" component="h1" style={{ textAlign: 'center' }}>
          {t('aboutUsTitle')}
        </Typography>
        <Divider />
        <Typography variant="h6" component="h2" style={{ whiteSpace: "pre-wrap" }}>
          {t('aboutUsText')}
        </Typography>
      </Box>
      <Box
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: { padding: theme.spacing(42) },
          [theme.breakpoints.down('md')]: { padding: theme.spacing(5) }
        })}>
        <Typography variant="h4" component="h1">
          {t('howToGetThere')}:
        </Typography>
        <div id="map" style={{ height: 480}}>
          <Map centerCoordinates={[38.56633674453089, -7.925327404275489]} markers={[ [38.56633674453089, -7.925327404275489] ]}/>
        </div>
      </Box>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Image src={logo} alt="logo" width={200} height={60} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Updates />
      </div>
    </StyledMain>
  );
};

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'homepage', 'footer', 'header']))
  }
});

export default Home;
