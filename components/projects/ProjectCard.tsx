import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import Image from 'next/image';
import example from '../../public/carousel1.jpg';
import { Bathtub, Home, KingBed, SquareFoot } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t, i18n } = useTranslation(['projectpage', 'common']);
  
  return (
    <Card>
      <CardActionArea>
        <CardHeader title={project.title} subheader="Localização: September 14, 2016" />
        <CardMedia>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image
              src={example}
              objectFit="contain" // or objectFit="cover"
            />
          </div>
        </CardMedia>
        <CardContent>
          <Grid container>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" sx={{display:"flex", alignItems: 'end'}}>
                <Home sx={{marginRight: "5px"}}/>{t("projectDetails.tipology")}: T4
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" sx={{display:"flex", alignItems: 'end'}}>
                <Bathtub sx={{marginRight: "5px"}}/>{t("projectDetails.bathrooms")}: 2
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" sx={{display:"flex", alignItems: 'end'}}>
                <SquareFoot sx={{marginRight: "5px"}}/>Area Interior: T4
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary" sx={{display:"flex", alignItems: 'end'}}>
                <KingBed sx={{marginRight: "5px"}}/>{t("projectDetails.bedrooms")}: 4
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Detalhes
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;

type ProjectCardProps = {
  project: Project;
};
