import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Typography, Zoom } from '@mui/material';
import { Square } from '@phosphor-icons/react';
import { useTranslation } from 'next-i18next';

import theme from '../../theme';

interface LotCounterProps {
  lots?: number;

  assignedLots?: number;
}

export const LotCounter = (props: LotCounterProps) => {
  const { lots, assignedLots } = props;

  const { t } = useTranslation(['projectpage', 'common']);

  const { ref, inView, entry } = useInView({
    /* Optional options */

    threshold: 0,

    triggerOnce: false
  });

  if (!lots || (assignedLots && assignedLots > lots)) {
    return;
  }

  let checks: boolean[] = new Array(lots).fill(false);

  if (assignedLots) {
    checks = checks.fill(true, 0, lots - assignedLots - 1);
  }

  const iconSize = 22;

  const availableText = t('typologyDetails.availableLotsCount', { assignedLots, lots });

  const initialDelay = 500 / lots;

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center' }}>
      <Typography>{t('typologyDetails.availableLotsTitle')}: </Typography>

      <div style={{}} role="group" aria-label={availableText}>
        {checks.map((check, index) => {
          return (
            <Zoom
              key={index}
              in={inView}
              style={{ transitionDelay: `calc(${initialDelay}ms * ${index})` }}>
              {check ? (
                <Square size={iconSize} weight="duotone" color={theme.palette.secondary.dark} />
              ) : (
                <Square size={iconSize} weight="duotone" color={theme.palette.success.dark} />
              )}
            </Zoom>
          );
        })}
      </div>
    </div>
  );
};
