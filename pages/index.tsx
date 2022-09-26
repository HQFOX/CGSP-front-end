import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Button from '@mui/material/Button';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CGSPCarousel from '../components/carousel/Carousel';

const Home: NextPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Head>
        <title>Cooperativa Giraldo Sem Pavor</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <CGSPCarousel />
        <Button variant="contained">{t('h1')}</Button>
      </main>
    </div>
  );
};

export const getStaticProps = async (ctx: any) => ({
  props: {
    ...(await serverSideTranslations(ctx.locale, ['common', 'footer', 'header']))
  }
});

export default Home;
