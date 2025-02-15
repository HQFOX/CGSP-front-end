import React from 'react';
import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import { HomeOutlined, HomeWorkOutlined, HowToRegOutlined, Info } from '@mui/icons-material';
import { Chip, Grid, Popover, Typography } from '@mui/material';

const StyledTypography = styled(Typography)({
  display: 'flex',
  alignItems: 'end'
});

const removeDuplicates = (data?: (string | undefined)[]) => {
  return [...new Set(data)];
};

export interface DetailsProps {
  project: Project;
  minimal?: boolean;
}

export const Details = ({ project, minimal = false }: DetailsProps) => {
  const { t } = useTranslation(['projectpage', 'common']);
  const [assignmentAnchorEl, setAssignmentAnchorEl] = React.useState<HTMLElement | null>(null);
  const [constructionAnchorEl, setConstructionAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleAssignmentPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAssignmentAnchorEl(event.currentTarget);
  };

  const handleAssignmentPopoverClose = () => {
    setAssignmentAnchorEl(null);
  };

  const handleConstructionPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setConstructionAnchorEl(event.currentTarget);
  };

  const handleConstructionPopoverClose = () => {
    setConstructionAnchorEl(null);
  };

  const openAssignment = Boolean(assignmentAnchorEl);

  const openConstruction = Boolean(constructionAnchorEl);

  const assignmentChips = (assignmentStatus: string) => {
    let variant: 'outlined' | 'filled' = 'outlined';
    let chipColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' =
      'info';
    let textColor;
    let popoverText;
    const label = t(`assignmentStatus.${assignmentStatus}`);

    switch (assignmentStatus) {
      case 'WAITING':
        variant = 'outlined';
        chipColor = 'info';
        popoverText = t(`assignmentStatus.info.${assignmentStatus}`);
        break;
      case 'ONGOING':
        variant = 'filled';
        chipColor = 'success';
        textColor = 'white';
        popoverText = t(`assignmentStatus.info.${assignmentStatus}`);
        break;
      case 'CONCLUDED':
        variant = 'filled';
        chipColor = 'warning';
        textColor = 'white';
        popoverText = t(`assignmentStatus.info.${assignmentStatus}`);
        break;
      default:
        variant = 'filled';
        chipColor = 'warning';
        textColor = 'white';
        break;
    }

    return (
      <>
        <Chip
          icon={<Info />}
          variant={variant}
          color={chipColor}
          label={label}
          sx={{ color: textColor, textTransform: 'capitalize', fontWeight: '700' }}
          onMouseEnter={handleAssignmentPopoverOpen}
          onMouseLeave={handleAssignmentPopoverClose}
        />
        <Popover
          id="mouse-over-popover-assignment"
          sx={{
            pointerEvents: 'none'
            // maxWidth: 600
          }}
          open={openAssignment}
          anchorEl={assignmentAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          onClose={handleAssignmentPopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 3 }} variant="body2" color="text.secondary">
            {popoverText}
          </Typography>
        </Popover>
      </>
    );
  };

  const constructionChips = (constructionStatus: string) => {
    let variant: 'outlined' | 'filled' = 'outlined';
    let chipColor: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' =
      'info';
    let textColor;
    const label = t(`constructionStatus.${constructionStatus}`);
    let popoverText;

    switch (constructionStatus) {
      case 'ALLOTMENTPERMIT':
        variant = 'outlined';
        chipColor = 'warning';
        popoverText = t(`constructionStatus.info.${constructionStatus}`);
        break;
      case 'BUILDINGPERMIT':
        variant = 'outlined';
        chipColor = 'success';
        popoverText = t(`constructionStatus.info.${constructionStatus}`);
        break;
      case 'ONGOING':
        variant = 'filled';
        chipColor = 'success';
        popoverText = t(`constructionStatus.info.${constructionStatus}`);
        break;
      case 'CONCLUDED':
        variant = 'filled';
        chipColor = 'success';
        textColor = 'white';
        popoverText = t(`constructionStatus.info.${constructionStatus}`);
        break;
      default:
        variant = 'outlined';
        chipColor = 'warning';
        popoverText = '';
        break;
    }

    return (
      <>
        <Chip
          icon={<Info />}
          variant={variant}
          color={chipColor}
          label={label}
          sx={{ color: textColor, textTransform: 'capitalize', fontWeight: '700' }}
          onMouseEnter={handleConstructionPopoverOpen}
          onMouseLeave={handleConstructionPopoverClose}
        />

        <Popover
          id="mouse-over-popover-construction"
          sx={{
            pointerEvents: 'none'
            // maxWidth: 600
          }}
          open={openConstruction}
          anchorEl={constructionAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          onClose={handleConstructionPopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 3 }} variant="body2" color="text.secondary">
            {popoverText}
          </Typography>
        </Popover>
      </>
    );
  };

  return (
    <Grid container justifyContent={'space-between'} spacing={1} paddingBottom={1}>
      <Grid item>
        <StyledTypography variant="body2" color="text.secondary">
          <HomeWorkOutlined sx={{ marginRight: '5px' }} />
          {t('projectDetails.typologies')}:{' '}
          {removeDuplicates(
            project.typologies
              ?.filter((details) => details.typology)
              .map((details) => details.typology + ' ')
          )}{' '}
          {removeDuplicates(
            project.typologies
              ?.filter((details) => details.type)
              .map((details) => details.type + '')
          )}
        </StyledTypography>
      </Grid>
      <Grid item textAlign={'center'}>
        <StyledTypography variant="body2" color="text.secondary">
          <HomeOutlined sx={{ marginRight: '5px' }} />
          {t('projectDetails.lots')}: {project.lots}
        </StyledTypography>
      </Grid>
      <Grid item>
        <StyledTypography variant="body2" color="text.secondary">
          <HowToRegOutlined sx={{ marginRight: '5px' }} />
          {t('projectDetails.assignedLots')}: {project.assignedLots}
        </StyledTypography>
      </Grid>
      {!minimal && project.assignmentStatus && (
        <Grid item>
          <Typography variant="body2" color="text.secondary" component={'span'}>
            {t('projectDetails.assignmentStatus')}:{' '}
          </Typography>
          {assignmentChips(project.assignmentStatus)}
        </Grid>
      )}
      {!minimal && project.constructionStatus && (
        <Grid item>
          <Typography variant="body2" color="text.secondary" component={'span'}>
            {t('projectDetails.constructionStatus')}:{' '}
          </Typography>
          {constructionChips(project.constructionStatus)}
        </Grid>
      )}
    </Grid>
  );
};
