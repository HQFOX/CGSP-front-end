import React from "react";

import { Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";

import Image from "next/image";
import { StyledButton } from "../Button";
import { Home, HomeWork, HowToReg } from "@mui/icons-material";
import styled from "@emotion/styled";
import router from "next/router";

interface ProjectCardPopUpProps {
    project: Project;
}

const StyledTypography = styled(Typography)({
	display: "flex",
	alignItems: "end"
});

const removeDuplicates = (data?: (string | undefined)[]) => {
	return  [...new Set(data)];
};

export const ProjectCardPopUp = ({ project }: ProjectCardPopUpProps) => {
	const { t } = useTranslation(["projectpage", "common"]);

	return (
		<Card sx={{ minWidth: 275, boxShadow: "none" }}>
			<CardHeader title={project.title} subheader={`${t("projectDetails.location")}: ${project.location}`} />
			<CardMedia>
				<div style={{ position: "relative", overflow: "hidden", height: "170px" }}>
					{ project.coverPhoto && <Image src={`${process.env.NEXT_PUBLIC_S3_URL}${project.coverPhoto}`} alt={`cover image for ${project.title} project`} fill style={{ objectFit: "cover" }} />}
				</div>
			</CardMedia>
			<CardContent>
				<Grid container justifyContent={"space-between"} >
					<Grid item>
						<StyledTypography variant="body2" color="text.secondary">
							<HomeWork sx={{ marginRight: "5px" }} />
							{t("projectDetails.typologies")}: {removeDuplicates(project.typologies?.map( details => details.typology + " "))} {removeDuplicates(project.typologies?.map( details => details.type + " "))}
						</StyledTypography>
					</Grid>
					<Grid item textAlign={"center"}>
						<StyledTypography variant="body2" color="text.secondary">
							<Home sx={{ marginRight: "5px" }} />
							{t("projectDetails.lots")}: {project.lots}
						</StyledTypography>
					</Grid>
					<Grid item>
						<StyledTypography variant="body2" color="text.secondary">
							<HowToReg sx={{ marginRight: "5px" }} />
							{t("projectDetails.assignedLots")}: {project.assignedLots}
						</StyledTypography>
					</Grid>
				</Grid>
			</CardContent>
			<CardActions>
				<StyledButton color="primary" variant="contained" sx={{  fontWeight: "600"}} onClick={() => router.push(`projects/${project.id}`)}>
					{t("projectDetails.details")}
				</StyledButton>
			</CardActions>
		</Card>
	);
};