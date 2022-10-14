import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';
import Image from 'next/image';
import example from '../../public/carousel1.jpg';

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card>
      <CardActionArea>
        <CardHeader title={project.title} subheader="September 14, 2016" />
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
              <Typography variant="body2" color="text.secondary">
                Tipologia: T4
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary">
                Casas de banho: 2
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary">
                Area Interior: T4
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" color="text.secondary">
                Valor: 150 000$
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;

type ProjectCardProps = {
  project: Project;
};
