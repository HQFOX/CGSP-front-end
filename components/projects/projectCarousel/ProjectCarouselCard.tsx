import React from "react";

import {
	CardMedia
} from "@mui/material";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProjectCarouselCard = ({ index, item, handleOpenModal, handleCloseModal }: CarouselCardProps) => {
	
	return (
		<CardMedia>
			<div style={{ height: 700, overflow: "hidden" }}>
				<Image
					alt=""
					src={item}
					fill={true} style={{ objectFit: "cover" }}
					onClick={handleOpenModal}
				/>
			</div>
		</CardMedia>
	);
};

type CarouselCardProps = {
  index: string;
  item: string;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
};

export default ProjectCarouselCard;
