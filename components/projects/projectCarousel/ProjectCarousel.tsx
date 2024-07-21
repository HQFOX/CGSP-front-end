import React, { useState } from "react";

import {
	Card,
	CardActions,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ProjectCarouselCard from "./ProjectCarouselCard";
import ProjectModal from "../../modals/projectModal/projectModal";
import {
	Fullscreen,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { StyledButton } from "../../Button";
import theme from "../../../theme";

const styles = {
	indicator: {
		marginTop: "1em"
	},
	activeIndicator: {
		color: theme.palette.primary.main,
	}
};

const allPhotos = (project: Project): ProjectFile[] => {
	const result = [];

	if(project.coverPhoto){
		result.push(project.coverPhoto);
	}
	if(project.files){
		result.push(...project.files);
	}

	return result;
};

export const ProjectCarousel = ({ project } : { project: Project}) => {
	const { t } = useTranslation(["projectpage"]);
	
	const [index, setIndex] = useState(0);
	const [files] = useState(allPhotos(project));
	const [openModal, setOpenModal] = useState(false);
	const [autoPlay, setAutoPlay] = useState(true);
	

	const handleShowModal = (index?: number) => {
		if(openModal){
			setOpenModal(false);
			setAutoPlay(true);
		} else {
			index && setIndex(index);
			setOpenModal(true);
			setAutoPlay(false);
		}
	};

	const handleCarouselItemChange = (index?: number) => {
		setIndex(index ?? 0);
	};

	return (
		<>
			<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
				<Carousel
					fullHeightHover
					indicatorContainerProps={{
						style: styles.indicator
					}}
					activeIndicatorIconButtonProps={{
						style: styles.activeIndicator
					}}
					index={index}
					onChange={handleCarouselItemChange}
					autoPlay={autoPlay}>
					{files.map((file, index) => ( file.filename &&
			<ProjectCarouselCard
				key={file.filename}
				index={index}
				item={`${process.env.NEXT_PUBLIC_S3_URL}${file.filename}`}
				handleShowModal={handleShowModal}
			/>
					))}
				</Carousel>
				<CardActions>
					<StyledButton
						style={{ marginLeft: "auto" }}
						variant={"outlined"}
						startIcon={<Fullscreen />}
						onClick={() => handleShowModal(index)}>
						{t("photoCategories.fullscreen")}
					</StyledButton>
				</CardActions>
			</Card>
			<ProjectModal
				open={openModal}
				modalOpen={() => handleShowModal(index)}
				modalClose={handleShowModal}
				files={files}
				index={index}
				autoPlay={autoPlay}
				handleCarouselItemChange={handleCarouselItemChange}
			/>
		</>
	);
};
