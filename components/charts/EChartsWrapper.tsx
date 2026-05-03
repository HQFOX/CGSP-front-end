import React, { CSSProperties, useEffect, useRef } from 'react';

import type { EChartsOption, SetOptionOpts } from 'echarts';

import { PieChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { ECharts } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PieChart, LegendComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

export interface ReactEChartsProps {
	option: EChartsOption;
	style?: CSSProperties;
	settings?: SetOptionOpts;
	loading?: boolean;
	theme?: 'light' | 'dark';
}

export const EChartsWrapper = ({ option, style, settings, loading, theme }: ReactEChartsProps) => {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Initialize chart
		let chart: ECharts | undefined;
		if (chartRef.current !== null) {
			chart = echarts.init(chartRef.current, theme);
		}

		// Add chart resize listener
		// ResizeObserver is leading to a bit janky UX
		function resizeChart() {
			chart?.resize();
		}
		window.addEventListener('resize', resizeChart);

		// Return cleanup function
		return () => {
			chart?.dispose();
			window.removeEventListener('resize', resizeChart);
		};
	}, [theme]);

	useEffect(() => {
		// Update chart
		if (chartRef.current !== null) {
			const chart = echarts.getInstanceByDom(chartRef.current);
			chart?.setOption(option, settings);
		}
	}, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

	useEffect(() => {
		// Update chart
		if (chartRef.current !== null) {
			const chart = echarts.getInstanceByDom(chartRef.current);
			loading === true ? chart?.showLoading() : chart?.hideLoading();
		}
	}, [loading, theme]);

	return <div ref={chartRef} style={{ width: '100%', minHeight: '400px', ...style }} />;
};
