import { Box, Button, Dialog, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import Image from "next/image";
import construction0 from '../../public/1/construction/construcao0.jpg';


type projectModalProps = {
    open: boolean,
    modalOpen: () => void
    modalClose: () => void
}


const ProjectModal = ({open, modalOpen, modalClose}: projectModalProps) => {
    return (
        <Dialog
            fullScreen
            open={open}
            onClose={modalClose}
            sx={{p:5}}
            >
            <Box display={"flex"}>
                <Button sx={{ marginLeft: 'auto'}}onClick={modalClose}><CancelIcon/></Button>
            </Box>
            <Image
                layout="responsive"
                src={construction0}/>
        </Dialog>
    )
};

export default ProjectModal;