import React, { ReactNode, SetStateAction } from "react";
import { ArrowBackIos } from "@mui/icons-material";
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	styled
} from "@mui/material";
import Link from "next/link";
import theme from "../../theme";
import { useRouter } from "next/router";

export interface VerticalNavigationProps {
  open?: boolean;
  pages?: { id: number; text: string; path: string; icon: ReactNode }[];
  setOpen: (value: SetStateAction<boolean>) => void;
}



const drawerWidth = 240;

export const StyledListItemButton = styled(ListItemButton)({
	":hover" : {
		backgroundColor: "#FF7F514D",
	},

});

export const VerticalNavigation = ({ open, pages, setOpen }: VerticalNavigationProps) => {

	const router = useRouter();

	console.log(router.pathname);

	console.log(pages);

	return (
		<Drawer
			variant={"persistent"}
			open={open}
			sx={{
				width: `${drawerWidth}px`,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					backgroundColor: theme.bg.main,
					width: drawerWidth,
					boxSizing: "border-box"
				}
			}}>
			<Box sx={{ padding: "10px", display: "flex", height: "92px", justifyContent: "space-between", alignItems: "center"}}>
				<Typography
					variant={"h5"}
					sx={{ marginTop: "auto", padding: "5px", verticalAlign: "bottom" }}>
          Menu
				</Typography>
				<IconButton onClick={() => setOpen(!open)} size="large">
					<ArrowBackIos />
				</IconButton>
			</Box>
			<Divider />
			<nav aria-label="admin page navigation">
				<List>
					{pages &&
            pages.map((page) => (
            	<ListItem key={page.id}>
            		<Link key={page.id} href={page.path} passHref style={{ width: "100%"}}>
            			<StyledListItemButton selected={router.pathname === page.path}>
            				<ListItemIcon>{page.icon}</ListItemIcon>
            				<ListItemText>{page.text}</ListItemText>
            			</StyledListItemButton>
            		</Link>
            	</ListItem>
            ))}
				</List>
			</nav>
		</Drawer>
	);
};
