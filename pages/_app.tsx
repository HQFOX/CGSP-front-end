import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import { ThemeProvider } from "@emotion/react";
import theme from "../theme";
import { appWithTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "../components/loading/Loading";
import { AuthContext } from "../components/AuthContext";
import { AuthenticationGuard } from "../components/AuthenticationGuard";


function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const [user, setUser] = useState<User | undefined>();

	const [isAuth, setIsAuth] = useState(false);


	const checkAdminRoute = () => {
		if(router.pathname.includes("/admin")){
			return true;
		}
		return false;
	};

	const handleStop = () => {
		setLoading(false);
	};

	const handleStart = () => {
		setLoading(true);
	};

	useEffect(() => {
 
		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleStop);
		router.events.on("routeChangeError", handleStop);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleStop);
			router.events.off("routeChangeError", handleStop);
		};


	},[router]);

  
	return (
		<ThemeProvider theme={theme}>
			<AuthContext.Provider value={{user: user, setUser: setUser, isAuth, setIsAuth}}>
				<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
					integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
					crossOrigin=""/>
				<script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
					integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
					crossOrigin=""></script>
				{checkAdminRoute() ? 
					<AuthenticationGuard guardType={checkAdminRoute() ? "authenticated" : "unauthenticated"} >
						<Layout isAdmin={true}>
							{loading ? <Loading height='70vh'/> : <Component {...pageProps} />}
						</Layout>
					</AuthenticationGuard>
					:
					<Layout isAdmin={false}>
						{loading ? <Loading height='70vh'/> : <Component {...pageProps} />}
					</Layout>
				}
			</AuthContext.Provider>
		</ThemeProvider>
	);
}

export default appWithTranslation(MyApp);
