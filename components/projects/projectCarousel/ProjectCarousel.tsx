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

const ProjectCarousel = ({ project } : { project?: Project}) => {
	const [index, setIndex] = useState(0);
	const [openModal, setOpenModal] = useState(false);
	const [autoPlay, setAutoPlay] = useState(true);
	const { t } = useTranslation(["projectpage"]);


	const handleOpenModal = (index: number) => {
		setIndex(index);
		setOpenModal(true);
		setAutoPlay(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setAutoPlay(true);
	};

	const handleCarouselItemChange = (index?: number) => {
		index ? setIndex(index) : setIndex(0);
	};

	const carouselItems = () => {
		const allPhotos =  project?.files ?  [project?.coverPhoto, ...(project?.files ?? [])] : [ project?.coverPhoto ] ;

		return allPhotos.map((file, index) => ( file &&
			<ProjectCarouselCard
				key={`file${index}`}
				index={index.toString()}
				item={`${process.env.NEXT_PUBLIC_S3_URL}${file.filename}`}
				handleOpenModal={() => handleOpenModal(index)}
				handleCloseModal={handleCloseModal}
			/>
		));
	};

	return (
		<>
			<Card sx={{ border: "1px solid rgb(237, 237, 237)", boxShadow: 0}}>
				<Carousel
					fullHeightHover
					indicatorContainerProps={{
						style: {
							marginTop: "1em"
						}
					}}
					activeIndicatorIconButtonProps={{
						style: {
							color: theme.palette.primary.main,
						}
					}}
					index={index}
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					onChange={(now?: number, next?) => handleCarouselItemChange(now)}
					autoPlay={autoPlay}>
					{carouselItems()}
				</Carousel>
				<CardActions>
					<StyledButton
						style={{ marginLeft: "auto" }}
						variant={"outlined"}
						startIcon={<Fullscreen />}
						onClick={() => handleOpenModal(index)}>
						{t("photoCategories.fullscreen")}
					</StyledButton>
				</CardActions>
			</Card>
			<ProjectModal
				open={openModal}
				modalOpen={() => handleOpenModal(index)}
				modalClose={handleCloseModal}
				files={project?.files ?? []}
				index={index}
				autoPlay={autoPlay}
				handleCarouselItemChange={handleCarouselItemChange}
			/>
		</>
	);
};

export default ProjectCarousel;
