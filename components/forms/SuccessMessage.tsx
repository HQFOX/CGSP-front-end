import React from "react";
import { CheckCircle } from "@mui/icons-material";
import { Grow, Stack, Typography } from "@mui/material";

export interface SuccessMessageProps {
    title: string;
    subtitle?: string;
}

export const SuccessMessage = ({title, subtitle}: SuccessMessageProps) => {

	return (
		<Grow in={true}>
			<Stack alignContent={"center"} pt={6} sx={{ textAlign: "center" }}>
				<CheckCircle color={"success"} style={{ fontSize: "120px", margin: "auto" }} />
				<Typography variant="h5">{title}</Typography>
				{subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
			</Stack>
		</Grow>
	);
};