import { Box, Button, CardMedia, Dialog, IconButton, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import Image from "next/image";
import construction0 from '../../public/1/construction/construcao0.jpg';
import Carousel from "react-material-ui-carousel";
import { StyledIconButton } from "./projectModal.styles";


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
            sx={{ p:3 }}
            >
            <StyledIconButton color="primary" onClick={modalClose}><CancelIcon/></StyledIconButton>
            <Carousel sx={{ flex: 1}} autoPlay={autoPlay} fullHeightHover navButtonsAlwaysVisible index={index} onChange={(now?:number, next?) => handleCarouselItemChange(now)}>
                {items.map((item, i) => (
                <Box
                    key={`carousel${index}`}
                    sx={{
                        backgroundImage: `url(${item.image.src})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: { xs: 'cover', md: 'auto' },
                        width: '100%',
                        height: '80vh',
                    }}>
                </Box>
                ))}
            </Carousel>
        </Dialog>
    )
};

export default ProjectModal;