import React from "react";
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Grid,
	Typography
} from "@mui/material";
import Image from "next/image";
import example from "../../public/carousel1.jpg";
import { Home, HomeWork, HowToReg } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const StyledTypography = styled(Typography)({
	display: "flex",
	alignItems: "end"
});

const ProjectCard = ({ project }: ProjectCardProps) => {
	const { t } = useTranslation(["projectpage", "common"]);

	return (
		<Card>
			<CardActionArea>
				<CardHeader title={project.title} subheader={`${t("projectDetails.location")}: ${project.location}`} />
				<CardMedia>
					<div style={{ position: "relative", overflow: "hidden", height: "400px" }}>
						<Image src={example} alt={`cover image for ${project.title} project`} fill={true} style={{ objectFit: "cover" }} />
					</div>
				</CardMedia>
				<CardContent>
					<Grid container>
						<Grid item md={6}>
							<StyledTypography variant="body2" color="text.secondary">
								<HomeWork sx={{ marginRight: "5px" }} />
								{t("projectDetails.typologies")}: {project.typologies?.map( details => details.typology + " " )}
							</StyledTypography>
						</Grid>
						<Grid item md={6}>
							<StyledTypography variant="body2" color="text.secondary">
								<Home sx={{ marginRight: "5px" }} />
								{t("projectDetails.lots")}: {project.lots}
							</StyledTypography>
						</Grid>
						<Grid item md={6}>
							<StyledTypography variant="body2" color="text.secondary">
								<HowToReg sx={{ marginRight: "5px" }} />
								{t("projectDetails.assignedLots")}: {project.assignedLots}
							</StyledTypography>
						</Grid>
					</Grid>
					<StyledTypography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
					</StyledTypography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<Button size="small" color="primary">
					{t("projectDetails.details")}
				</Button>
			</CardActions>
		</Card>
	);
};

export default ProjectCard;

type ProjectCardProps = {
  project: Project;
};
