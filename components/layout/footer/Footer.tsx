import { Grid, Stack, styled, Typography } from "@mui/material";

import React from "react";
import ihru from "../../../public/IHRU.svg";
import logo from "../../../public/logowhite.svg";
import cme from "../../../public/LOGOEVORA_CORES.webp";
import Image from "next/image";

import FacebookIcon from "@mui/icons-material/Facebook";
import { useTranslation } from "next-i18next";
import { HomeRounded, LocalPhone, Email } from "@mui/icons-material";
import Link from "next/link";

const StyledFooter = styled("footer")(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: "white",
	padding: theme.spacing(2)
}));

const StyledItem = styled(Grid)(({ theme }) => ({
	[theme.breakpoints.down("md")]: {
		textAlign: "center"
	}
}));

const StyledStack = styled(Stack)<{side? : "left" | "right" }>(({ theme, side="left" }) => ({
	alignItems: "center",
	justifyContent: side === "left" ? "flex-start" : "flex-end",
	[theme.breakpoints.down("md")]: {
		justifyContent: "center"
	}
}));

const Footer = () => {
	const { t } = useTranslation("footer");

	return (
		<StyledFooter>
			<Grid container spacing={2}>
				<StyledItem item xs={12} md={4}>
					<Link href="https://www.facebook.com/profile.php/?id=100008109739037" target="_blank" rel="noopener noreferrer" title="Facebook Page">
						<FacebookIcon fontSize="large" aria-label="Facebook Page"/>
					</Link>
					<Typography variant="subtitle1" fontWeight={700} component={"h1"}>{t("supportEntities")}:</Typography>
					<StyledStack direction="row" gap={1}>
						<Typography variant="subtitle1" component={Link} href="https://www.ihru.pt/" target="_blank" rel="noopener noreferrer">
              Instituto da Habitação e da <br/>Reabilitação Urbana - IHRU
						</Typography>
						<Image src={ihru} alt="IHRU logo" width={150} height={30} />
					</StyledStack>
					<StyledStack direction="row" gap={1}>
						<Typography variant="subtitle1" component={Link} href="https://www.cm-evora.pt/" target="_blank" rel="noopener noreferrer">Câmara Municipal de Évora - CME</Typography>
						<Image src={cme} alt="CME logo" width={120} height={50} />
					</StyledStack>
				</StyledItem>
				<Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
					<Image src={logo} alt="Cooperativa Giraldo Sem Pavor logo" width={150} height={50} />
				</Grid>
				<StyledItem item xs={12} md={4} textAlign="right">
					<Typography variant="h5" fontWeight={600} component={"h2"}>{t("contactsTitle")}:</Typography>
					<StyledStack direction="row" gap={1} side="right">
						<HomeRounded/>
						<Typography variant="subtitle1" component={"span"}>
							{t("address")}: Évora B. Malagueira R. do Sarrabulho 4{" "}
						</Typography>
					</StyledStack>
					<StyledStack direction="row" gap={1} side="right">
						<LocalPhone/>
						<Typography variant="subtitle1" component={"span"}>{t("telephone")}: 266737970, 963022787</Typography>
					</StyledStack>
					<StyledStack direction="row" gap={1} side="right">
						<Email/>
						<Typography variant="subtitle1" component={"span"}>{t("email")}: geral@cchegiraldosp.pt</Typography>
					</StyledStack>
				</StyledItem>
			</Grid>
		</StyledFooter>
	);
};

export default Footer;
