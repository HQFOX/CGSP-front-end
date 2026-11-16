import React from 'react';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsDashboard } from './AnalyticsDashboard';
import type { AnalyticsReport } from './api';
import { lastDaysRange } from './api';

const report: AnalyticsReport = {
	startDate: '2026-10-07',
	endDate: '2026-11-03',
	summary: {
		activeUsers: 1234,
		newUsers: 800,
		sessions: 1500,
		pageViews: 4200,
		averageSessionDuration: 95.4
	},
	daily: [{ date: '2026-11-03', activeUsers: 12, sessions: 15, pageViews: 42 }],
	topPages: [{ path: '/projects', pageViews: 2000, activeUsers: 600 }],
	channels: [{ name: 'Organic Search', sessions: 900 }],
	devices: [{ name: 'mobile', sessions: 1000 }]
};

const renderDashboard = () =>
	render(
		<QueryClientProvider client={new QueryClient()}>
			<AnalyticsDashboard />
		</QueryClientProvider>
	);

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('lastDaysRange', () => {
	it('covers the given number of days, today included, in local dates', () => {
		expect(lastDaysRange(28, new Date(2026, 10, 3, 23, 30))).toEqual({
			startDate: '2026-10-07',
			endDate: '2026-11-03'
		});
		expect(lastDaysRange(1, new Date(2026, 0, 1))).toEqual({
			startDate: '2026-01-01',
			endDate: '2026-01-01'
		});
	});
});

describe('AnalyticsDashboard', () => {
	const fetchMock = vi.fn();

	beforeEach(() => {
		process.env.NEXT_PUBLIC_API_URL = 'http://api';
		vi.stubGlobal('fetch', fetchMock);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		fetchMock.mockReset();
	});

	it('shows the totals and top pages of the last 28 days', async () => {
		fetchMock.mockResolvedValue(jsonResponse(report));

		renderDashboard();

		expect(await screen.findByText('/projects')).toBeTruthy();
		expect(screen.getByText(new Intl.NumberFormat('pt-PT').format(1234))).toBeTruthy();
		expect(screen.getByText('1m 35s')).toBeTruthy();

		const { startDate, endDate } = lastDaysRange(28);
		const url = new URL(fetchMock.mock.calls[0][0]);
		expect(url.pathname).toBe('/analytics/report');
		expect(url.searchParams.get('startDate')).toBe(startDate);
		expect(url.searchParams.get('endDate')).toBe(endDate);
	});

	it('requests the selected range', async () => {
		fetchMock.mockResolvedValue(jsonResponse(report));

		renderDashboard();
		await screen.findByText('/projects');
		await userEvent.click(screen.getByRole('button', { name: '7 dias' }));

		await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
		const url = new URL(fetchMock.mock.calls[1][0]);
		expect(url.searchParams.get('startDate')).toBe(lastDaysRange(7).startDate);
	});

	it('explains when Google Analytics is not configured', async () => {
		fetchMock.mockResolvedValue(jsonResponse({ message: 'not configured' }, 503));

		renderDashboard();

		expect(await screen.findByText(/não está configurado/)).toBeTruthy();
		// 503 is not retried
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
