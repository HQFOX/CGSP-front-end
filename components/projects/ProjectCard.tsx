import React from "react";
import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
} from "@mui/material";
import Image from "next/image";

import { useTranslation } from "react-i18next";

import { StyledButton } from "../Button";
import router from "next/router";
import { Details } from "../details/Details";
import { Title } from "../Title";


const ProjectCard = ({ project }: ProjectCardProps) => {
	const { t } = useTranslation(["projectpage", "common"]);
	
	

	return (
		<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
			<CardHeader title={<Title>{project.title}</Title>} subheader={`${t("projectDetails.district")}: ${project.district}`} />
			<CardMedia>
				<div style={{ position: "relative", overflow: "hidden", height: "400px" }}>
					{ project.coverPhoto && <Image src={`${process.env.NEXT_PUBLIC_S3_URL}${project.coverPhoto.filename}`} alt={`cover image for ${project.title} project`} fill style={{ objectFit: "cover" }} />}
				</div>
			</CardMedia>
			<CardContent>
				<Details project={project} />
			</CardContent>
			<CardActions>
				<StyledButton color="primary" variant="contained" sx={{  fontWeight: "600", boxShadow: 0}} onClick={() => router.push(`projects/${project.id}`)}>
					{t("projectDetails.details")}
				</StyledButton>
			</CardActions>
		</Card>
	);
};

export default ProjectCard;

type ProjectCardProps = {
  project: Project;
};
