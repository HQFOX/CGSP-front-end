import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
	typography: {
		fontFamily: ["Inter", "sans-serif" ].join(","),
	},
	palette: {
		primary: {
			main: "#FF7F51",
			light: "#ffbf8a",
			dark: "#c75f30",
			contrastText: "#fff"
		},
		secondary: {
			main: "#f0efc0",
			light: "#ffffff",
			dark: "#a2a2a2"
		},
		warning: {
			main: "#f7cb42",

		},
		error: {
			main: "#f92b5b"
		},
		success: {
			main: "#9ae3bb"
		},
		info: {
			dark: "#40a7cc",
			main: "#48bce5"
		}
	},
	//custom theme variables
	bg: {
		main: "#F9F9F9",
		light: "#F4F5F7",
	},
	text: {
		main: "#F5F5F5",
		light: "#262930"
	}
});

export default theme;
