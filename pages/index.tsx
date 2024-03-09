import React from "react";

import { Box, Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";

import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

import styles from "../styles/Home.module.css";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styled from "@emotion/styled";

import CGSPCarousel from "../components/carousel/Carousel";
import logo from "../public/logo.svg";
import theme from "../theme";
import { Title } from "../components/Title";
import { Architecture, BookmarkAdd, Construction, Description, Group, MeetingRoom, OpenInNew, PersonAdd, Savings } from "@mui/icons-material";
import { StyledButton } from "../components/Button";
import Link from "next/link";
import { LatLngTuple } from "leaflet";

const Map = dynamic(() => import("../components/map/Map"), {
	ssr: false
},
);

const StyledMain = styled("main")({
	backgroundColor: "white",
});

const CGSPcenterCoordinates: LatLngTuple = [38.56633674453089, -7.925327404275489];



const Home: NextPage<{updates : Update[] }> = ( ) => {
	const { t } = useTranslation(["homepage", "common"]);

	return (
		<StyledMain className={styles.container && styles.main}>
			<CGSPCarousel />
			<Box sx={{backgroundColor: "rgb(249, 249, 249)", mt: 8, pb: 6}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4, textIndent: 35 }} id="aboutus">
						<Title variant="h4" component="h1" fontSize={24}>
							Quem Somos?
						</Title>
						<Divider sx={{mb: 4}}/>
						<Typography variant="body2" color="text.secondary">
						A Cooperativa Giraldo Sem Pavor é uma cooperativa de construção e habitação sediada em Évora, desde xxxx, que opera na região do Alentejo.
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Esta instituição emerge da união de vontades e interesses em resolver questões essenciais, como garantir habitação digna para famílias, indivíduos ou grupos ocasionais. A cooperativa procura proporcionar soluções sustentáveis e abrangentes, atendendo às necessidades fundamentais da comunidade.
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Por conseguinte, o foco principal desta cooperativa é viabilizar aos seus cooperantes o acesso à habitação a custos controlados, resultando em preços mais acessíveis em comparação aos valores de mercado.
						</Typography>
						<Typography variant="body2" color="text.secondary">						
							Dentro desse contexto, comprometemo-nos ativamente a estabelecer parcerias estratégicas com profissionais como arquitetos, empresas de construção e câmaras municipais. Através desta colaboração, procuramos não apenas desenhar, mas também concretizar projetos habitacionais inovadores e acessíveis. Os empreendimentos são cuidadosamente planeados, proporcionando não apenas casas, mas lares, nos quais os nossos cooperantes têm a oportunidade de se inscrever.						
						</Typography>			
						<div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
							<Image src={logo} alt="logo" width={200} height={60} />
						</div>
					</Box>
				</Box>
			</Box>
			<Box sx={{backgroundColor: theme.palette.secondary.light, textIndent: 10 , pb: 8, pt: 8}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4 }} id="aboutus">
						<Title variant="h4" component="h1" fontSize={24}>
							Como Funciona?
						</Title>
						<Divider />
					</Box>
					<Grid container columnSpacing={2}>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title >Elaboração do Projeto</Title>}  avatar={<Architecture color="success" />}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Os terrenos são adquiridos pela cooperativa e é feito um projeto em conjunto com os Arquitetos.<br />
										O projeto é submetido para aprovação pela Câmara.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<><Title>Inscrição</Title></>} avatar={<PersonAdd color="success"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Os sócios inscrevem-se na cooperativa para a compra de casa, pagando uma verba de 2.5 € por mês , 25 € de Jóia e 100 € euros de capital social, que será reembolsado  um dia que o sócio desista dessa condição.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>Reserva</Title>} avatar={<BookmarkAdd color="success"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Quando o projeto de arquitetura é aprovado pela Câmara, os sócios são convidados a consultar o mesmo e a fazerem a sua reserva de habitação, caso assim decidam, mediante o pagamento de uma verba de cerca de 5.000,00€ que será reembolsado caso desistam posteriormente, ou descontado posteriormente no custo da habitação.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>Construção</Title>} avatar={<Construction color="success"/>} />
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Após aprovação de Loteamento pela respetiva Câmara Municipal, pode começar a fase de construção.<br />
										Nesta fase são disponibilizadas  atualizações da construção nesta plataforma. É também possível para os cooperantes agendar connosco  visitas guiadas aos locais de construção.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Box sx={{backgroundColor: "rgb(249, 249, 249)", textIndent: 10, pb: 8, pt: 8 }}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pt: 6, pb: 6
					})}>
					<Box sx={{ pb: 4 }} id="aboutus">
						<Title variant="h4" component="h1" fontSize={24}>
							Vantagens
						</Title>
						<Divider />
					</Box>
					<Grid container columnSpacing={2}>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title >Custos Controlados</Title>}  avatar={<Savings color="primary" />}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Por ser uma cooperativa de habitação e construção podemos beneficiar da taxa reduzida do Imposto sobre o Valor Acrescentado (IVA) e transmitir esse benefício ao cooperante.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<><Title>Transparência</Title></>} avatar={<MeetingRoom color="primary"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
											Todo processo pode ser acompanhado pelo cooperante através de atualizações, notificadas por email ou contacto telefónico, nesta plataforma.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>Burocracia Simplificada</Title>} avatar={<Description color="primary"/>}/>
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										O longo e difícil processo burocrático é integralmente tratado pela cooperativa.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={1} md={3}>
							<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
								<CardHeader title={<Title>Sem Intermediários</Title>} avatar={<Group color="primary"/>} />
								<CardContent>
									<Typography variant="body2" color="text.secondary">
										Contacto direto com o cliente.
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Box sx={{ pt: 4, pb: 8}}>
				<Box
					sx={(theme) => ({
						[theme.breakpoints.up("md")]: { paddingLeft: theme.spacing(15), paddingRight: theme.spacing(15) },
						[theme.breakpoints.down("md")]: { paddingLeft: theme.spacing(5), paddingRight: theme.spacing(15) },
						pb: 4,
						pt: 4
					})}>
					<Title variant="h5" component="h1" fontSize={24}>
						{t("howToGetThere")}:
					</Title>
					<Divider />
					<Box id="map" style={{ height: 480}} sx={{pt: 2}}>
						<Map 
							centerCoordinates={CGSPcenterCoordinates} 
							markers={[ CGSPcenterCoordinates ]} 
							popupContent={
								<Link target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${CGSPcenterCoordinates[0]}%2C${CGSPcenterCoordinates[1]}`} passHref>
									<StyledButton endIcon={<OpenInNew />}>Ver No Google Maps</StyledButton>
								</Link>
							}
						/>
					</Box>
				</Box>
			</Box>
		</StyledMain>
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps = async (ctx: any) => {
  
	const res = await fetch(`${process.env.API_URL}/update`);
	const updates = (await res.json()) as Update[];

	return { props: { 
		updates,
		...(await serverSideTranslations(ctx.locale, ["common", "footer", "header", "homepage"]))
	}};
};

export default Home;
