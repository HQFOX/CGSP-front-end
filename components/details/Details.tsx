import React from "react";

import { HomeOutlined, HomeWorkOutlined, HowToRegOutlined, Info } from "@mui/icons-material";
import { Chip, Grid, Popover, Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";

const StyledTypography = styled(Typography)({
	display: "flex",
	alignItems: "end"
});

const removeDuplicates = (data?: (string | undefined)[]) => {
	return  [...new Set(data)];
};

export interface DetailsProps {
    project: Project
}

export const Details = ({ project } : DetailsProps) => {
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
		const label = t(`assignmentStatus.${assignmentStatus}`);
	
		switch(assignmentStatus){
		case("WAITING"):
			variant = "outlined";
			chipColor = "info";
			break;
		case("ONGOING"):
			variant = "filled";
			chipColor = "success";
			textColor = "white";
			break;
		case("CONCLUDED"):
			variant = "filled";
			chipColor = "warning";
			textColor = "white";
			break;
		default:
			variant = "filled";
			chipColor = "warning";
			textColor = "white";
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

	const constructionChips = (constructionStatus: string) => {

		let variant: "outlined" | "filled" = "outlined";
		let chipColor: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "info";
		let textColor;
		const label = t(`constructionStatus.${constructionStatus}`);
		let popoverText;
	
		switch(constructionStatus){
		case("ALLOTMENTPERMIT"):
			variant = "outlined";
			chipColor = "warning";
			popoverText = "";
			break;
		case("BUILDINGPERMIT"):
			variant = "outlined";
			chipColor = "success";
			popoverText = "";
			break;
		case("ONGOING"):
			variant = "filled";
			chipColor = "success";
			popoverText = "O processo de construção está a decorrer";
			break;
		case("CONCLUDED"):
			variant = "filled";
			chipColor = "success";
			textColor = "white";
			popoverText = "O processo de construção foi terminado.";
			break;
		default:
			variant = "outlined";
			chipColor = "warning";
			popoverText = "";
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
					<Typography sx={{ p: 1 }}>{popoverText}</Typography>
				</Popover>
			</>
		);
	};

	return (
		<Grid container justifyContent={"space-between"} spacing={1} paddingBottom={1} >
			<Grid item>
				<StyledTypography variant="body2" color="text.secondary">
					<HomeWorkOutlined sx={{ marginRight: "5px" }} />
					{t("projectDetails.typologies")}: {removeDuplicates(project.typologies?.map( details => details.typology + " "))} {removeDuplicates(project.typologies?.map( details => details.type + " "))}
				</StyledTypography>
			</Grid>
			<Grid item textAlign={"center"}>
				<StyledTypography variant="body2" color="text.secondary">
					<HomeOutlined sx={{ marginRight: "5px" }} />
					{t("projectDetails.lots")}: {project.lots}
				</StyledTypography>
			</Grid>
			<Grid item>
				<StyledTypography variant="body2" color="text.secondary">
					<HowToRegOutlined sx={{ marginRight: "5px" }} />
					{t("projectDetails.assignedLots")}: {project.assignedLots}
				</StyledTypography>
			</Grid>
			{project.assignmentStatus &&
            <Grid item>
            	<Typography variant="body2" color="text.secondary" component={"span"}>{t("projectDetails.assignmentStatus")}: </Typography>{assignmentChips(project.assignmentStatus)}
            </Grid>
			}
			{project.constructionStatus &&
        <Grid item>
        	<Typography variant="body2" color="text.secondary" component={"span"}>{t("projectDetails.constructionStatus")}: </Typography>{constructionChips(project.constructionStatus)}
        </Grid>
			}
		</Grid>
	);
};