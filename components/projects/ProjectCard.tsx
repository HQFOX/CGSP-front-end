import React from 'react';

import styled from '@emotion/styled';
import { CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import router from 'next/router';

import { StyledButton } from '../Button';
import { StyledCard } from '../StyledCard';
import { Title } from '../Title';
import { Details } from '../details/Details';

const StyledDiv = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  height: '400px'
});

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation(['projectpage', 'common']);

  return (
    <StyledCard variant="outlined">
      <CardHeader
        title={<Title>{project.title}</Title>}
        subheader={`${t('projectDetails.district')}: ${project.district}`}
      />
      <CardMedia>
        <StyledDiv>
          {project.coverPhoto && (
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_URL}${project.coverPhoto.filename}`}
              alt={`cover image for ${project.title} project`}
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
        </StyledDiv>
      </CardMedia>
      <CardContent>
        <Details project={project} />
      </CardContent>
      <CardActions>
        <StyledButton
          color="primary"
          variant="contained"
          sx={{ fontWeight: '600', boxShadow: 0 }}
          onClick={() => router.push(`projects/${project.id}`)}>
          {t('projectDetails.details')}
        </StyledButton>
      </CardActions>
    </StyledCard>
  );
};

export default ProjectCard;

type ProjectCardProps = {
  project: Project;
};
