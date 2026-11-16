import React, { useMemo, useState } from 'react';

import type { EChartsOption } from 'echarts';

import {
	Alert,
	Box,
	CardContent,
	CardHeader,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	ToggleButton,
	ToggleButtonGroup,
	Typography
} from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { StyledCard } from '../StyledCard';
import { Title } from '../Title';
import { DynamicEChartsWrapper } from '../charts/DynamicEChartsWrapper';
import { Loading } from '../loading';
import {
	AnalyticsReport,
	AnalyticsUnavailableError,
	fetchAnalyticsReport,
	getAnalyticsReportQueryKey,
	lastDaysRange
} from './api';

const RANGE_OPTIONS = [7, 28, 90] as const;

// Validated categorical slots (fixed order) and recessive chart ink
const SERIES_COLORS = ['#2a78d6', '#eb6834', '#1baf7a'];
const TEXT_SECONDARY = '#52514e';
const GRID_LINE = '#e8e8e6';

const DEVICE_LABELS: Record<string, string> = {
	desktop: 'Computador',
	mobile: 'Telemóvel',
	tablet: 'Tablet'
};

const numberFormat = new Intl.NumberFormat('pt-PT');

const formatDuration = (seconds: number) => {
	const total = Math.round(seconds);
	return `${Math.floor(total / 60)}m ${String(total % 60).padStart(2, '0')}s`;
};

// "2026-10-03" -> "03/10"
const formatDay = (isoDate: string) => `${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`;

const dailyOptions = (daily: AnalyticsReport['daily']): EChartsOption => {
	const series = [
		{ name: 'Visualizações', key: 'pageViews' },
		{ name: 'Sessões', key: 'sessions' },
		{ name: 'Utilizadores', key: 'activeUsers' }
	] as const;
	return {
		color: SERIES_COLORS,
		tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
		legend: { top: 0, left: 0, textStyle: { color: TEXT_SECONDARY } },
		grid: { left: 8, right: 110, top: 40, bottom: 8, containLabel: true },
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: daily.map((day) => formatDay(day.date)),
			axisLine: { lineStyle: { color: GRID_LINE } },
			axisTick: { show: false },
			axisLabel: { color: TEXT_SECONDARY }
		},
		yAxis: {
			type: 'value',
			minInterval: 1,
			splitLine: { lineStyle: { color: GRID_LINE } },
			axisLabel: { color: TEXT_SECONDARY }
		},
		series: series.map(({ name, key }) => ({
			name,
			type: 'line',
			data: daily.map((day) => day[key]),
			showSymbol: false,
			symbolSize: 8,
			lineStyle: { width: 2 },
			emphasis: { focus: 'series' },
			// Direct label at the line end, so identity doesn't rely on color alone
			endLabel: { show: true, formatter: '{a}', color: TEXT_SECONDARY }
		}))
	};
};

const barOptions = (rows: { name: string; sessions: number }[]): EChartsOption => {
	// Horizontal bars draw bottom-up, so reverse to put the largest on top
	const ordered = [...rows].reverse();
	return {
		tooltip: { trigger: 'item', valueFormatter: (value) => `${value} sessões` },
		grid: { left: 8, right: 48, top: 8, bottom: 8, containLabel: true },
		xAxis: { type: 'value', show: false },
		yAxis: {
			type: 'category',
			data: ordered.map((row) => row.name),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: TEXT_SECONDARY }
		},
		series: [
			{
				type: 'bar',
				data: ordered.map((row) => row.sessions),
				itemStyle: { color: SERIES_COLORS[0], borderRadius: [0, 4, 4, 0] },
				barMaxWidth: 18,
				label: {
					show: true,
					position: 'right',
					color: TEXT_SECONDARY,
					formatter: ({ value }) => numberFormat.format(value as number)
				}
			}
		]
	};
};

const KpiTile = ({ label, value }: { label: string; value: string }) => (
	<StyledCard variant="outlined" sx={{ height: '100%' }}>
		<CardContent>
			<Typography variant="body2" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="h4" component="p" sx={{ fontWeight: 600, mt: 0.5 }}>
				{value}
			</Typography>
		</CardContent>
	</StyledCard>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<StyledCard variant="outlined" sx={{ height: '100%' }}>
		<CardHeader title={<Title>{title}</Title>} sx={{ pb: 0 }} />
		<CardContent>{children}</CardContent>
	</StyledCard>
);

const Empty = () => (
	<Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
		Sem dados neste período
	</Typography>
);

export const AnalyticsDashboard = () => {
	const [days, setDays] = useState<number>(28);

	// Recomputed only when the range changes, so the query key stays stable between renders
	const range = useMemo(() => lastDaysRange(days), [days]);

	const { data, error, isPending, isPlaceholderData } = useQuery({
		queryKey: getAnalyticsReportQueryKey(range),
		queryFn: () => fetchAnalyticsReport(range),
		placeholderData: keepPreviousData,
		// GA takes hours to process data; there is no point in refetching often
		staleTime: 10 * 60 * 1000,
		retry: (failureCount, err) => !(err instanceof AnalyticsUnavailableError) && failureCount < 2
	});

	const daily = useMemo(() => (data ? dailyOptions(data.daily) : undefined), [data]);
	const channels = useMemo(() => (data ? barOptions(data.channels) : undefined), [data]);
	const devices = useMemo(
		() =>
			data
				? barOptions(
						data.devices.map((row) => ({ ...row, name: DEVICE_LABELS[row.name] ?? row.name }))
					)
				: undefined,
		[data]
	);

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
				<ToggleButtonGroup
					size="small"
					exclusive
					value={days}
					onChange={(_event, value: number | null) => value && setDays(value)}
					aria-label="Período">
					{RANGE_OPTIONS.map((option) => (
						<ToggleButton key={option} value={option}>
							{option} dias
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</Box>

			{error && !data ? (
				<Alert severity={error instanceof AnalyticsUnavailableError ? 'info' : 'error'}>
					{error instanceof AnalyticsUnavailableError
						? 'O Google Analytics não está configurado ou não está disponível de momento.'
						: 'Não foi possível carregar os dados do Google Analytics.'}
				</Alert>
			) : isPending || !data ? (
				<Loading />
			) : (
				<Box sx={{ opacity: isPlaceholderData ? 0.6 : 1, transition: 'opacity 0.2s' }}>
					<Grid container spacing={2} sx={{ mb: 2 }}>
						{[
							{
								label: 'Utilizadores ativos',
								value: numberFormat.format(data.summary.activeUsers)
							},
							{ label: 'Novos utilizadores', value: numberFormat.format(data.summary.newUsers) },
							{ label: 'Sessões', value: numberFormat.format(data.summary.sessions) },
							{
								label: 'Visualizações de página',
								value: numberFormat.format(data.summary.pageViews)
							},
							{
								label: 'Duração média da sessão',
								value: formatDuration(data.summary.averageSessionDuration)
							}
						].map((kpi) => (
							<Grid key={kpi.label} size={{ xs: 6, md: 'grow' }}>
								<KpiTile {...kpi} />
							</Grid>
						))}
					</Grid>

					<Grid container spacing={2}>
						<Grid size={12}>
							<ChartCard title="Tráfego diário">
								{daily && <DynamicEChartsWrapper option={daily} style={{ height: 360 }} />}
							</ChartCard>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<ChartCard title="Sessões por canal">
								{data.channels.length && channels ? (
									<DynamicEChartsWrapper
										option={channels}
										style={{ height: 260, minHeight: 260 }}
									/>
								) : (
									<Empty />
								)}
							</ChartCard>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<ChartCard title="Sessões por dispositivo">
								{data.devices.length && devices ? (
									<DynamicEChartsWrapper option={devices} style={{ height: 260, minHeight: 260 }} />
								) : (
									<Empty />
								)}
							</ChartCard>
						</Grid>
						<Grid size={12}>
							<ChartCard title="Páginas mais vistas">
								{data.topPages.length ? (
									<Table size="small">
										<TableHead>
											<TableRow>
												<TableCell>Página</TableCell>
												<TableCell align="right">Visualizações</TableCell>
												<TableCell align="right">Utilizadores</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{data.topPages.map((page) => (
												<TableRow key={page.path}>
													<TableCell sx={{ wordBreak: 'break-all' }}>{page.path}</TableCell>
													<TableCell align="right">{numberFormat.format(page.pageViews)}</TableCell>
													<TableCell align="right">
														{numberFormat.format(page.activeUsers)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								) : (
									<Empty />
								)}
							</ChartCard>
						</Grid>
					</Grid>
				</Box>
			)}
		</Box>
	);
};
