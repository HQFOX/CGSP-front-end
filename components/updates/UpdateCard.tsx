/* eslint-disable indent */
import { Typography, Paper, Box, Divider, Grid } from "@mui/material";
import Image from "next/image";
import React from "react";
import { StyledButton } from "../Button";
import { Launch } from "@mui/icons-material";
import router from "next/router";

const width = "40vw";

const UpdateCard = ({ post }: UpdateCardProps) => {

	const date = post.creationDate? new Date(post.creationDate) : undefined;

	const handleClick = (projectId?: string) => {
		projectId && router.push(`projects/${projectId}`);
	};

	return (
		<Paper
			sx={(theme) => ({
				[theme.breakpoints.up("md")]: { width: width },
				[theme.breakpoints.down("md")]: { width: "90vw" }
			})}
			elevation={4}>
			<Box sx={{ p: 4 }}>
				<Grid container>
					<Grid item xs={11}>
						<Typography variant={"h5"}>{post.title}</Typography>
					</Grid>
					<Grid item xs={1} alignSelf={"end"}>
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: "right", mt: "auto"}}>
							{date && `${date?.getUTCDate()}/${date?.getUTCMonth()}/${date?.getUTCFullYear()}`}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Divider sx={{ mb: 1 }} />
					</Grid>
					{ post.project &&
					<Grid item>
						<Typography variant={"subtitle2"} component={"span"} color="text.secondary" style={{ paddingTop: "2px"}}>Sobre o projeto:</Typography><StyledButton endIcon={<Launch />} onClick={() => handleClick(post.project?.projectId)}>{post.project?.title}</StyledButton>
					</Grid>
					}
				</Grid>
			</Box>
			{post.files[0] && 
				<div style={{width: "100%", height: "60vh", position: "relative"}}>
					<Image src={`${process.env.NEXT_PUBLIC_S3_URL}${post.files[0].filename}`} alt={""} fill style={{objectFit: "cover"}}/>
				</div>
			}
			<Box sx={{ p: 4 }}>
				<Typography variant="body2" color="text.secondary">
					{post.content}
				</Typography>
			</Box>
			{/* <Grid container direction={"row-reverse"}>
				<Grid item padding={2} >
					<StyledButton variant="contained" endIcon={<Launch />}>Ver Projeto</StyledButton>
				</Grid>
			</Grid> */}
		</Paper>
	);
};

export default UpdateCard;

type UpdateCardProps = {
  post: Update;
};
