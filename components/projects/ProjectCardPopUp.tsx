import React from 'react';
import { useTranslation } from 'next-i18next';

import { Card, CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import Image from 'next/image';
import router from 'next/router';

import { StyledButton } from '../Button';
import { Details } from '../details/Details';

interface ProjectCardPopUpProps {
  project: Project;
}

export const ProjectCardPopUp = ({ project }: ProjectCardPopUpProps) => {
  const { t } = useTranslation(['projectpage', 'common']);

  return (
    <Card sx={{ minWidth: 275, boxShadow: 'none' }}>
      <CardHeader
        title={project.title}
        subheader={`${t('projectDetails.district')}: ${project.district}`}
      />
      <CardMedia>
        <div style={{ position: 'relative', overflow: 'hidden', height: '170px' }}>
          {project.coverPhoto && (
            <Image
              src={`${process.env.NEXT_PUBLIC_S3_URL}${project.coverPhoto.filename}`}
              alt={`cover image for ${project.title} project`}
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      </CardMedia>
      <CardContent>
        <Details project={project} minimal />
      </CardContent>
      <CardActions>
        <StyledButton
          color="primary"
          variant="contained"
          sx={{ fontWeight: '600' }}
          onClick={() => router.push(`projects/${project.id}`)}
        >
          {t('projectDetails.details')}
        </StyledButton>
      </CardActions>
    </Card>
  );
};
