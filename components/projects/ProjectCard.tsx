/* eslint-disable indent */
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
	Popover,
	Typography
} from "@mui/material";
import Image from "next/image";
import { Home, HomeWork, HowToReg, Info } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { StyledButton } from "../Button";

const StyledTypography = styled(Typography)({
	display: "flex",
	alignItems: "end"
});

const constructionChips = (constructionStatus: string) => {
	switch(constructionStatus){
	    case("ALLOTMENTPERMIT"):
		    return <Chip icon={<Info/>} variant="outlined" color="warning" label={"Alvará de Loteamento Aprovado"} sx={{ textTransform: "capitalize", fontWeight: "700"}}/>;
	    case("BUILDINGPERMIT"):
		    return <Chip icon={<Info/>} variant="outlined" color="success" label={"Alvará de Construção Aprovado"} sx={{ textTransform: "capitalize", fontWeight: "700"}}/>;
	    case("ONGOING"):
		    return <Chip icon={<Info/>} variant="filled" color="success" label={"A Decorrer"} sx={{ color: "white", textTransform: "capitalize", fontWeight: "700"}}/>;
	    case("CONCLUDED"):
		    return <Chip icon={<Info/>} variant="filled" color="success" label={"Concluído"} sx={{ color: "white", textTransform: "capitalize", fontWeight: "700"}}/>;
	    default:
		    return <></>;
	}
};

const removeDuplicates = (data?: (string | undefined)[]) => {
	return  [...new Set(data)];
};

const ProjectCard = ({ project }: ProjectCardProps) => {
	const { t } = useTranslation(["projectpage", "common"]);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
	  setAnchorEl(event.currentTarget);
	};
  
	const handlePopoverClose = () => {
	  setAnchorEl(null);
	};
  
	const open = Boolean(anchorEl);

	const assignmentChips = (assignmentStatus: string) => {

		let variant: "outlined" | "filled" = "outlined";
		let chipColor: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "info";
		let textColor;
		let label;
	
		switch(assignmentStatus){
			case("WAITING"):
				variant = "outlined";
				chipColor = "info";
				label = "Em Espera";
			break;
			case("ONGOING"):
				variant = "filled";
				chipColor = "success";
				textColor = "white";
				label = "A decorrer";
				break;
			case("CONCLUDED"):
				variant = "filled";
				chipColor = "warning";
				textColor = "white";
				label = "Concluído";
			break;
			default:
				variant = "filled";
				chipColor = "warning";
				textColor = "white";
				label = "Concluído";
			break;
		}
	
		return (
			<>
				<Chip icon={<Info />} variant={variant} color={chipColor} label={label} sx={{ color: textColor, textTransform: "capitalize", fontWeight: "700" }} onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}/>
		
				<Popover
					id="mouse-over-popover"
					sx={{
						pointerEvents: "none",
					}}
					open={open}
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					transformOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}
					onClose={handlePopoverClose}
					disableRestoreFocus
				>
					<Typography sx={{ p: 1 }}>I use Popover.</Typography>
				</Popover>
			</>
		);
	};
	

	return (
		<Card>
			<CardActionArea>
				<CardHeader title={project.title} subheader={`${t("projectDetails.location")}: ${project.location}`} />
				<CardMedia>
					<div style={{ position: "relative", overflow: "hidden", height: "400px" }}>
						{ project.coverPhoto && <Image src={project.coverPhoto} alt={`cover image for ${project.title} project`} fill style={{ objectFit: "cover" }} />}
					</div>
				</CardMedia>
				<CardContent>
					<Grid container justifyContent={"space-between"} spacing={1} paddingBottom={1} >
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
						{project.assignmentStatus &&
							<Grid item>
								<Typography variant="body2" color="text.secondary" component={"span"}>Estado Atribuição: </Typography>{assignmentChips(project.assignmentStatus)}
							</Grid>
						}
						{project.constructionStatus &&
						<Grid item>
							<Typography variant="body2" color="text.secondary" component={"span"}>Estado de Construção: </Typography>{constructionChips(project.constructionStatus)}
						</Grid>
						}
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
