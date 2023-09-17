import React from "react";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export const ProjectTable = ({projects}: {projects?: Project[]}) => {
    

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Project Title</TableCell>
						<TableCell align="right">Location</TableCell>
						<TableCell align="right">Status</TableCell>
						<TableCell align="right">typology</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{projects?.map((row) => (
						<TableRow
							key={row.id}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{row.title}
							</TableCell>
							<TableCell align="right">{row.location}</TableCell>
							<TableCell align="right">{row.status}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};