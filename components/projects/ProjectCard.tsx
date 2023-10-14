import React from "react";
import {
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	Grid,
	Typography
} from "@mui/material";
import Image from "next/image";
import example from "../../public/carousel1.jpg";
import { Home, HomeWork, HowToReg } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { StyledButton } from "../Button";

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
						<Image src={example} alt={`cover image for ${project.title} project`} fill style={{ objectFit: "cover" }} />
					</div>
				</CardMedia>
				<CardContent>
					<Grid container justifyContent={"space-between"} spacing={1} paddingBottom={1} >
						<Grid item md={4}>
							<StyledTypography variant="body2" color="text.secondary">
								<HomeWork sx={{ marginRight: "5px" }} />
								{t("projectDetails.typologies")}: {project.typologies?.map( details => details.typology + " " )}
							</StyledTypography>
						</Grid>
						<Grid item md={4} textAlign={"center"}>
							<StyledTypography variant="body2" color="text.secondary">
								<Home sx={{ marginRight: "5px" }} />
								{t("projectDetails.lots")}: {project.lots}
							</StyledTypography>
						</Grid>
						<Grid item md={4}>
							<Typography variant="body2" color="text.secondary" component={"span"}>Status: </Typography><Chip variant="filled" color="success" label={"Concluído"} sx={{ color: "white", textTransform: "capitalize", fontWeight: "700"}}/>
						</Grid>
						<Grid item md={4}>
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
				<StyledButton color="primary" variant="contained" sx={{  fontWeight: "600"}}>
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
