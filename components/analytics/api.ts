import { dataFetch } from '../forms/utils';

// Mirrors AnalyticsReportDTO in the back end (GET /analytics/report)
export interface AnalyticsReport {
	startDate: string;
	endDate: string;
	summary: {
		activeUsers: number;
		newUsers: number;
		sessions: number;
		pageViews: number;
		/** Seconds */
		averageSessionDuration: number;
	};
	/** One entry per day of the range, days without traffic included */
	daily: { date: string; activeUsers: number; sessions: number; pageViews: number }[];
	topPages: { path: string; pageViews: number; activeUsers: number }[];
	channels: { name: string; sessions: number }[];
	devices: { name: string; sessions: number }[];
}

export interface AnalyticsRange {
	startDate: string;
	endDate: string;
}

/** The back end answers 503 when Google Analytics isn't configured or can't be reached */
export class AnalyticsUnavailableError extends Error {}

export const getAnalyticsReportQueryKey = (range: AnalyticsRange) =>
	['analytics', 'report', range] as const;

export const fetchAnalyticsReport = async ({
	startDate,
	endDate
}: AnalyticsRange): Promise<AnalyticsReport> => {
	const params = new URLSearchParams({ startDate, endDate });
	const res = await dataFetch(
		'GET',
		`${process.env.NEXT_PUBLIC_API_URL}/analytics/report?${params}`,
		null,
		true
	);
	if (res.status === 503) throw new AnalyticsUnavailableError();
	if (!res.ok) throw new Error('Error fetching analytics ' + res.status);
	return (await res.json()) as AnalyticsReport;
};

/** Local calendar date as YYYY-MM-DD (toISOString would shift it to UTC) */
const toLocalIsoDate = (date: Date) => {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
};

/** The last `days` days, today included */
export const lastDaysRange = (days: number, today = new Date()): AnalyticsRange => {
	const start = new Date(today);
	start.setDate(start.getDate() - (days - 1));
	return { startDate: toLocalIsoDate(start), endDate: toLocalIsoDate(today) };
};
