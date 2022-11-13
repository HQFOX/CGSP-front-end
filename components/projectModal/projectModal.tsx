import { Button, Dialog, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import Image from "next/image";
import construction0 from '../../public/1/construction/construcao0.jpg';


type projectModalProps = {
    open: boolean,
    modalOpen: (open: boolean) => void
}


const ProjectModal = ({open, modalOpen}: projectModalProps) => {
    return (
        <Dialog
            fullScreen
            open={open}
            sx={{p:5}}
            >
                <Typography>Hello World</Typography>
                <Button onClick={()=> modalOpen(open)}><CancelIcon/></Button>
            <Image
                layout="fill"
                src={construction0}/>
        </Dialog>
    )
};

export default ProjectModal;