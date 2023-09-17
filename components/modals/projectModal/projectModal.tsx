/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box, Dialog, IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Carousel from "react-material-ui-carousel";
import { StyledIconButton } from "./projectModal.styles";
import { Close } from "@mui/icons-material";


type projectModalProps = {
    open: boolean,
    modalOpen: () => void
    modalClose: () => void,
    items: CarouselItem[],
    index: number,
    autoPlay: boolean,
    handleCarouselItemChange: (index?:number) => void
}


const ProjectModal = ({open, modalOpen, modalClose, items, index, autoPlay, handleCarouselItemChange}: projectModalProps) => {
	return (
		<Dialog
			fullScreen
			open={open}
			onClose={modalClose}
			sx={{ p:2 }}
		>
			<IconButton
				aria-label="close"
				onClick={modalClose}
				sx={{
					ml: "auto",
					mt: 1,
					mr: 2,
				}}
			>
				<Close />
			</IconButton>
			<Carousel sx={{marginTop: 2}} autoPlay={autoPlay} fullHeightHover navButtonsAlwaysVisible index={index} onChange={(now?:number, next?) => handleCarouselItemChange(now)}>
				{items.map((item) => (
					<Box
						key={`carousel${index}`}
						sx={{
							backgroundImage: `url(${item.image.src})`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center",
							backgroundSize: { xs: "cover", md: "auto" },
							width: "100%",
							height: "80dvh",
						}}>
					</Box>
				))}
			</Carousel>
		</Dialog>
	);
};

export default ProjectModal;