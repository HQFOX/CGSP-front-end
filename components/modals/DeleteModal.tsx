import React from "react";
import { Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Close } from "@mui/icons-material";

export const DeleteModal = ({open, data, handleClose }:{open: boolean, data?: Update, handleClose: (confirm: boolean) => void}) => {

	return (
		<Dialog
			open={open}
			onClose={() => handleClose(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{"Apagar"}
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
                Tem a certeza que quer apagar o post {data?.title}? <br/>
                Todos os dados perdidos.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" autoFocus onClick={() => handleClose(false)}>Não</Button>
				<Button variant="outlined" onClick={() => handleClose(true)}>
                    Sim
				</Button>
			</DialogActions>
		</Dialog>
	);
};