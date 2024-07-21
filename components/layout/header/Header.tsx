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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledAppBar = styled(AppBar)(
	({ theme }) => `
    background-color: ${theme.bg.light}
`
);

const Header = () => {
	const { t } = useTranslation("header");
	const router = useRouter();

	const locales = router.locales;

	const [language] = useState(router.locale);

	const pages = [
		{
			id: 1,
			headerText: t("home"),
			path: "/"
		},
		{
			id: 2,
			headerText: t("projects"),
			path: "/projects"
		},
		{
			id: 3,
			headerText: t("history"),
			path: "/history"
		},
		{
			id: 4,
			headerText: t("updates"),
			path: "/updates"
		},
		// {
		// 	id: 5,
		// 	headerText: t("faq"),
		// 	path: "/faq"
		// }
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
					<Box
						component="a"
						href="/"
						sx={{
							mr: 2,
							p: 2,
							display: { xs: "none", md: "flex" }
						}}>
						<Image src={logo} alt="Cooperativa Giraldo Sem Pavor logo" width={180} height={60} priority/>
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
								vertical: "bottom",
								horizontal: "left"
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left"
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: { xs: "block", md: "none" }
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
							display: { xs: "flex", md: "none" },
							flexGrow: 1
						}}>
						<Image src={logo} alt="logo" width={120} height={40} />
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
								"aria-labelledby": "languageDropdown"
							}}>
							{locales?.map((locale, index) => (
								<MenuItem key={index} onClick={() => handleClose(locale)}>
									{t(`languages.${locale}`)}
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
						{pages.map((page) => (
							<Link key={page.id} href={page.path} passHref>
								<Button 
									tabIndex={-1}
									sx={{ paddingLeft: "15px", paddingRight: "15px", paddingTop: "7px", paddingBottom: "7px", display: "block", borderRadius: "60px", color: "white", textTransform: "none", textAlign: "center", fontWeight: "700"}}
									disableElevation variant='contained'>
									{page.headerText}
								</Button>
							</Link>
						))}
						{/* <Box sx={{ mr: 0, justifyContent: "center" }}> */}
						<Button
							id="languageDropdown"
							aria-haspopup="true"
							onClick={handleClick}
							endIcon={<ExpandMoreIcon />}
							variant="outlined"
							sx={{ maxHeight: 40, textTransform: "none" }}>
							{t(`languages.${language}`)}
						</Button>
						<Menu
							id="languageDropdown-menu"
							anchorEl={anchorEl}
							open={open}
							onClose={() => handleClose()}
							MenuListProps={{
								"aria-labelledby": "languageDropdown"
							}}>
							{locales?.map((locale, index) => (
								<MenuItem key={index} onClick={() => handleClose(locale)}>
									{t(`languages.${locale}`)}
								</MenuItem>
							))}
						</Menu>
						{/* </Box> */}
					</Box>
				</Toolbar>
			</Container>
		</StyledAppBar>
	);
};

export default Header;
