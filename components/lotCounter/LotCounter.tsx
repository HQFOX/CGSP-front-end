import React, { useState } from 'react';

import { Square } from "@phosphor-icons/react";

import { useInView } from 'react-intersection-observer';

import { Popover, Typography, Zoom } from "@mui/material";

import theme from "../../theme";
import { useTranslation } from 'next-i18next';


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
      });
    

    if(!lots || assignedLots && assignedLots > lots){
        return;
    }

    let checks: boolean[] = new Array(lots).fill(false);

    if(assignedLots){
        checks = checks.fill(true,0,(lots - assignedLots) -1)
    }

    const iconSize = 22

    const availableText = t("typologyDetails.availableLotsCount", { assignedLots, lots })

    return (
        <div ref={ref} style={{ display: "flex", alignItems: "center"}}>
            <Typography>{t("typologyDetails.availableLotsTitle")}: </Typography>        
            <div style={{ display: "flex" }} role="group" aria-label={availableText} >
            {checks.map((check, index) => {
                return (
                    <Zoom in={inView} style={{ transitionDelay: `calc(100ms * ${index})`}}>
                        {check ? <Square size={iconSize} weight="duotone" color={theme.palette.secondary.dark} /> : <Square size={iconSize} weight="duotone" color={theme.palette.success.dark} />}
                    </Zoom>
                )
                })}
            </div>
        </div>
    )
}