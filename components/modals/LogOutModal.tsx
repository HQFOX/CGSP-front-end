import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { StyledButton } from "../Button";

export const LogOutModal = ({open, handleClose }:{open: boolean, handleClose: (confirm: boolean) => void}) => {

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			aria-labelledby="logout-dialog"
			aria-describedby="logout-dialog"
		>
			<DialogTitle id="logout-dialog-title">
				Logout
			</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={() => handleClose(false)}
				sx={{
					position: "absolute",
					right: 8,
					top: 8,
				}}
			>
				<Close />
			</IconButton>
			<DialogContent dividers>
				<DialogContentText id="logout-dialog-description">
                Tem a certeza que quer terminar a sessão?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<StyledButton variant="contained" autoFocus onClick={() => handleClose(false)}>Não</StyledButton>
				<StyledButton variant="outlined" onClick={() => handleClose(true)}>
                    Sim
				</StyledButton>
			</DialogActions>
		</Dialog>
	);
};