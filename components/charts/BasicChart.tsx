import React from 'react';

import { EChartsWrapper, ReactEChartsProps } from './EChartsWrapper';

// const option: ReactEChartsProps["option"] = {
// 	title: {
// 		text: "Pedidos de Inscrição"
// 	},
// 	tooltip: {
// 		trigger: "axis",
// 		axisPointer: {
// 			type: "cross",
// 			label: {
// 				backgroundColor: "#6a7985"
// 			}
// 		}
// 	},
// 	legend: {
// 		data: ["projeto1", "projeto2", "projeto3", "projeto5", "projeto6"]
// 	},
// 	toolbox: {
// 		feature: {
// 			saveAsImage: {}
// 		}
// 	},
// 	grid: {
// 		left: "3%",
// 		right: "4%",
// 		bottom: "3%",
// 		containLabel: true
// 	},
// 	xAxis: [
// 		{
// 			// type: "category",
// 			boundaryGap: false,
// 			data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
// 		}
// 	],
// 	yAxis: [
// 		{
// 			type: "value"
// 		}
// 	],
// 	series: [
// 		{
// 			name: "Email",
// 			type: "line",
// 			stack: "Total",
// 			areaStyle: {},
// 			emphasis: {
// 				focus: "series"
// 			},
// 			data: [120, 132, 101, 134, 90, 230, 210]
// 		},
// 		{
// 			name: "Union Ads",
// 			type: "line",
// 			stack: "Total",
// 			areaStyle: {},
// 			emphasis: {
// 				focus: "series"
// 			},
// 			data: [220, 182, 191, 234, 290, 330, 310]
// 		},
// 		{
// 			name: "Video Ads",
// 			type: "line",
// 			stack: "Total",
// 			areaStyle: {},
// 			emphasis: {
// 				focus: "series"
// 			},
// 			data: [150, 232, 201, 154, 190, 330, 410]
// 		},
// 		{
// 			name: "Direct",
// 			type: "line",
// 			stack: "Total",
// 			areaStyle: {},
// 			emphasis: {
// 				focus: "series"
// 			},
// 			data: [320, 332, 301, 334, 390, 330, 320]
// 		},
// 		{
// 			name: "Search Engine",
// 			type: "line",
// 			stack: "Total",
// 			label: {
// 				show: true,
// 				position: "top"
// 			},
// 			areaStyle: {},
// 			emphasis: {
// 				focus: "series"
// 			},
// 			data: [820, 932, 901, 934, 1290, 1330, 1320]
// 		}
// 	]
// };

const basicChartOptions = (chartData: Project[]): ReactEChartsProps['option'] => ({
  title: {
    // text: "Total de Pedidos de Inscrição"
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: chartData.map((project) => project.title)
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '9%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'time',
      boundaryGap: ['0', '0']
    }
  ],
  yAxis: [
    {
      minInterval: 1,
      type: 'value',
      boundaryGap: ['0', '0.1']
    }
  ],
  dataZoom: [
    {
      id: 'dataZoomX',
      type: 'slider',
      xAxisIndex: [0],
      filterMode: 'empty'
    }
  ],
  series: chartData.map((project) => ({
    name: project.title,
    type: 'line',
    // stack: "Total",
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: [
      [project.createdOn, 0],
      ...project.enrollRequests?.map((request, index) => [request.createdOn, index + 1]) ?? [],
      [new Date().toISOString().slice(0, 10), project.enrollRequests?.length]
    ]
  }))
  // {
  // 	name: "Union Ads",
  // 	type: "line",
  // 	stack: "Total",
  // 	areaStyle: {},
  // 	emphasis: {
  // 		focus: "series"
  // 	},
  // 	data: [220, 182, 191, 234, 290, 330, 310]
  // },
  // {
  // 	name: "Video Ads",
  // 	type: "line",
  // 	stack: "Total",
  // 	areaStyle: {},
  // 	emphasis: {
  // 		focus: "series"
  // 	},
  // 	data: [150, 232, 201, 154, 190, 330, 410]
  // },
  // {
  // 	name: "Direct",
  // 	type: "line",
  // 	stack: "Total",
  // 	areaStyle: {},
  // 	emphasis: {
  // 		focus: "series"
  // 	},
  // 	data: [320, 332, 301, 334, 390, 330, 320]
  // },
  // {
  // 	name: "Search Engine",
  // 	type: "line",
  // 	stack: "Total",
  // 	label: {
  // 		show: true,
  // 		position: "top"
  // 	},
  // 	areaStyle: {},
  // 	emphasis: {
  // 		focus: "series"
  // 	},
  // 	data: [820, 932, 901, 934, 1290, 1330, 1320]
  // }
});

export const BasicChart = ({ chartData = [] }: { chartData: Project[] }) => {
  return (
    <div style={{ display: 'flex' }}>
      <EChartsWrapper option={basicChartOptions(chartData)} style={{ height: '400px' }} />
    </div>
  );
};
