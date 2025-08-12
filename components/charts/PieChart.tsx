import React from 'react';

import { EChartsOption } from 'echarts';

import { CardContent, CardHeader } from '@mui/material';

import { StyledCard } from '../StyledCard';
import { Title } from '../Title';
import { EChartsWrapper } from './EChartsWrapper';

interface KpiPieProps {
  title: string;
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const KpiPie = ({ title, data }: KpiPieProps) => {
  const option: EChartsOption = {
    color: data.map((el) => el.color),
    tooltip: {
      trigger: 'item',
      confine: false
    },
    legend: {
      orient: 'vertical',
      top: 'top',
      left: 'left'
    },
    title: {
      show: false
    },
    series: [
      {
        type: 'pie',
        radius: ['0%', '40%'],
        center: ['65%', '22%'], // Move chart to the right
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((el) => ({ name: el.name, value: el.value }))
      }
    ]
  };

  return (
    <StyledCard variant="outlined" style={{ overflow: 'visible' }}>
      <CardHeader title={<Title>{title}:</Title>} />
      <CardContent style={{ height: '170px' }} sx={{ pt: 0 }}>
        <EChartsWrapper option={option} style={{ width: '100%' }} />
      </CardContent>
    </StyledCard>
  );
};
