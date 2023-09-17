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
			main: "#d9d9d9",
			light: "#ffffff",
			dark: "#a2a2a2"
		},
		error: {
			main: "#f92b5b"
		},
		success: {
			main: "#9ae3bb"
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
