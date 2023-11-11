import React, { useState } from "react";

import {
	Card,
	// CardContent,
	// Typography,
	CardActions,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import ProjectCarouselCard from "./ProjectCarouselCard";
import ProjectModal from "../../modals/projectModal/projectModal";
import {
	// Foundation,
	Fullscreen,
	// ViewInAr,
	// AutoAwesomeMosaic
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { StyledButton } from "../../Button";
import theme from "../../../theme";

enum CategoryType {
  "construction",
  "projection",
  "plant",
  "all"
}

const ProjectCarousel = ({ project } : { project?: Project}) => {
	const [category, setCategory] = useState<CategoryType>(CategoryType.all);
	const [index, setIndex] = useState<number>(0);
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [autoPlay, setAutoPlay] = useState<boolean>(true);
	const { t } = useTranslation(["projectpage"]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleSetCategory = (category: CategoryType) => {
		setCategory(category);
		setIndex(0);
	};

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

	const carouselItems = (category: CategoryType) => {
		switch (category) {
		case CategoryType.construction:
			return construction.map((item, i) => (
				<ProjectCarouselCard
					key={`${category + i}`}
					index={`${i}`}
					item={item}
					handleOpenModal={() => handleOpenModal(i)}
					handleCloseModal={handleCloseModal}
				/>
			));
		case CategoryType.projection:
			return projection.map((item, i) => (
				<ProjectCarouselCard
					key={`${category + i}`}
					index={`${i}`}
					item={item}
					handleOpenModal={() => handleOpenModal(i)}
					handleCloseModal={handleCloseModal}
				/>
			));
		case CategoryType.plant:
			return plant.map((item, i) => (
				<ProjectCarouselCard
					key={`${category + i}`}
					index={`${i}`}
					item={item}
					handleOpenModal={() => handleOpenModal(i)}
					handleCloseModal={handleCloseModal}
				/>
			));
		case CategoryType.all:
			return project?.files && project?.files.map((file, index) => (
				<ProjectCarouselCard
					key={`${category + index}`}
					index={index.toString()}
					item={`${process.env.NEXT_PUBLIC_S3_URL}${file.filename}`}
					handleOpenModal={() => handleOpenModal(index)}
					handleCloseModal={handleCloseModal}
				/>
			));
		}
	};

	const getItems = (category: CategoryType): CarouselItem[] => {
		switch (category) {
		case CategoryType.construction:
			return construction;
		case CategoryType.projection:
			return projection;
		case CategoryType.plant:
			return plant;
		default:
			return [] as CarouselItem[];
		}
	};
	return (
		<>
			<Card>
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
					{carouselItems(category)}
				</Carousel>
				{/* <CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{project?.title}
					</Typography>
					<Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
					</Typography>
				</CardContent> */}
				<CardActions>
					{/* <StyledButton
						variant={category === CategoryType.projection ? "contained" : "outlined"}
						onClick={() => {
							handleSetCategory(CategoryType.projection);
						}}
						startIcon={<ViewInAr />}>
						{t("photoCategories.projection")}
					</StyledButton>
					<StyledButton
						variant={category === CategoryType.plant ? "contained" : "outlined"}
						onClick={() => {
							handleSetCategory(CategoryType.plant);
						}}
						startIcon={<AutoAwesomeMosaic />}>
						{t("photoCategories.plant")}
					</StyledButton>
					<StyledButton
						variant={category === CategoryType.construction ? "contained" : "outlined"}
						onClick={() => {
							handleSetCategory(CategoryType.construction);
						}}
						startIcon={<Foundation />}>
						{t("photoCategories.construction")}
					</StyledButton> */}
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
				items={getItems(category)}
				index={index}
				autoPlay={autoPlay}
				handleCarouselItemChange={handleCarouselItemChange}
			/>
		</>
	);
};

export default ProjectCarousel;
