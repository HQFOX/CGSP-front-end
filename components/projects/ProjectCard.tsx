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
import styled from '@emotion/styled';

const StyledTypography = styled(Typography)({
  display: "flex",
  alignItems: "end",
})

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t, i18n } = useTranslation(['projectpage', 'common']);
  
  return (
    <Card>
      <CardActionArea>
        <CardHeader title={project.title} subheader={`Localização: ${project.location}`} />
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
              <StyledTypography variant="body2" color="text.secondary">
                <Home sx={{marginRight: "5px"}}/>{t("projectDetails.typology")}: T4
              </StyledTypography>
            </Grid>
            <Grid item md={6}>
              <StyledTypography variant="body2" color="text.secondary">
                <Bathtub sx={{marginRight: "5px"}}/>{t("projectDetails.bathrooms")}: 2
              </StyledTypography>
            </Grid>
            <Grid item md={6}>
              <StyledTypography variant="body2" color="text.secondary">
                <SquareFoot sx={{marginRight: "5px"}}/>{t("projectDetails.interiorArea")}: T4
              </StyledTypography>
            </Grid>
            <Grid item md={6}>
              <StyledTypography variant="body2" color="text.secondary">
                <KingBed sx={{marginRight: "5px"}}/>{t("projectDetails.bedrooms")}: 4
              </StyledTypography>
            </Grid>
          </Grid>
          <StyledTypography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </StyledTypography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          {t("projectDetails.details")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;

type ProjectCardProps = {
  project: Project;
};
