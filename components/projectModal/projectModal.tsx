import { Box, Button, CardMedia, Dialog, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import Image from "next/image";
import construction0 from '../../public/1/construction/construcao0.jpg';
import Carousel from "react-material-ui-carousel";


type projectModalProps = {
    open: boolean,
    modalOpen: () => void
    modalClose: () => void,
    items: CarouselItem[],
    index: number,
}


const ProjectModal = ({open, modalOpen, modalClose, items, index}: projectModalProps) => {
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={modalClose}
            sx={{ p:3 }}
            >
            <Button sx={{ alignSelf: "end", marginLeft: 'auto'}} onClick={modalClose}><CancelIcon/></Button>
            <Carousel sx={{ flex: 1}} autoPlay={false} fullHeightHover navButtonsAlwaysVisible>
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