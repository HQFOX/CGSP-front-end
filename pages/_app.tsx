import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/layout';
import { ThemeProvider } from '@emotion/react';
import theme from '../theme';
import { appWithTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '../components/loading/Loading';


function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true);

  const [isAdmin, setAdmin] = useState(true);

  const checkAdminRoute = () => {
    if(router.pathname.includes("/admin") && isAdmin){
      return true;
    }
    return false;
  }

  const [isAdminRoute, setAdminRoute] = useState(checkAdminRoute());

  useEffect(() => {
    const handleStart = () => {
      console.log("handle Start")
      setLoading(true);
    }

    setAdminRoute(checkAdminRoute());
 
    const handleStop = () => {
      setLoading(false);
    }



    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStart)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }


  },[router])

  
  return (
    <ThemeProvider theme={theme}>
      <Layout isAdmin={isAdminRoute}>
        {loading ? <Loading height='70vh'/> : <Component {...pageProps} />}
      </Layout>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
