import React, { useEffect, useMemo, useState } from 'react';

import { ThemeProvider } from '@emotion/react';
import { GoogleAnalytics } from '@next/third-parties/google';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { AuthContext } from '../components/AuthContext';
import { getUser } from '../components/forms/utils';
import Layout from '../components/layout/layout';
import { Loading } from '../components/loading/Loading';
import '../styles/globals.css';
import theme from '../theme';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | undefined>();

  const [isAuth, setIsAuth] = useState(false);

  const checkAdminRoute = () => router.pathname.includes('/admin');

  const handleStop = () => setLoading(false);

  const handleStart = () => setLoading(true);

  useMemo(() => {
    if (!user) {
      const cookie = Cookies.get('cgsptoken');
      if (cookie) {
        const decodedCookie: { sub: string; iat: number; exp: number } = jwtDecode(cookie);
        if (decodedCookie.sub) {
          getUser(decodedCookie.sub).then((value) => {
            setUser(value);
            setIsAuth(true);
          });
        }
      }
    }
  }, [user, setUser, isAuth]);

  useEffect(() => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  const authProviderValue = useMemo(
    () => ({ user, setUser, isAuth, setIsAuth }),
    [user, isAuth]
  );

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={authProviderValue}>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossOrigin=""
        />
        <Script
          src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
          integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
          crossOrigin=""
        ></Script>
        {!checkAdminRoute() && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLEID ?? ''} />}
        <Layout isAdmin={checkAdminRoute()}>
          {loading ? <Loading height="70vh" /> : <Component {...pageProps} />}
        </Layout>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp);
