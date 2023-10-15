import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { StyledButton } from "../Button";

export const CancelModal = ({open, handleClose }:{open: boolean, handleClose: (confirm: boolean) => void}) => {

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{"Cancelar Criação de Update"}
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
				<DialogContentText id="alert-dialog-description">
                Tem a certeza que quer cancelar? <br/>
                Todos os dados preenchidos serão perdidos
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