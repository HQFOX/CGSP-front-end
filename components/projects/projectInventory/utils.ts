import type { LatLngTuple } from 'leaflet';
import type { ParsedUrlQuery } from 'querystring';

import {
	FilterValuesDTO,
	GetAllProjectsCurrentParams,
	PageProjectListItemDTO
} from '../../../api/model';
import {
	getAllProjectsCurrent,
	getAllProjectsHistory,
	getFilterValues,
	getGetAllProjectsCurrentQueryKey,
	getGetAllProjectsHistoryQueryKey
} from '../../../api/project-controller/project-controller';
import { Beja, Evora, Portalegre } from '../../map/districtdata';
import { Setubal } from '../../map/districtdata/Setubal';

export type SearchParams = {
	title: string;
	district: string;
	assignmentStatus: AssignmentStatusType[];
	constructionStatus: ConstructionStatusType[];
	priceRange: number[];
	typologies: string[];
	types: string[];
	wildcard: string;
};

export type ViewType = 'card' | 'list' | 'map';

// The current and history endpoints accept the same filter params
export type ProjectsQueryParams = GetAllProjectsCurrentParams;

export const PROJECTS_PAGE_SIZE = 4;

export const districtCenterCoordinates: { [key: string]: LatLngTuple } = {
	Évora: Evora.geojson.properties.centros.centro.reverse() as LatLngTuple,
	Beja: Beja.geojson.properties.centros.centro.reverse() as LatLngTuple,
	Portalegre: Portalegre.geojson.properties.centros.centro.reverse() as LatLngTuple,
	Setúbal: Setubal.geojson.properties.centros.centro.reverse() as LatLngTuple
};

export const DISTRICT_OPTIONS = Object.keys(districtCenterCoordinates);

export const constructionStatusValues: ConstructionStatusType[] = [
	'ALLOTMENTPERMIT',
	'BUILDINGPERMIT',
	'CONCLUDED'
];

export const assignmentStatusValues: AssignmentStatusType[] = ['WAITING', 'ONGOING', 'CONCLUDED'];

// Only defined values are set, so the result is JSON-serializable for getServerSideProps
export const searchParamsToApiParams = (
	search: Partial<SearchParams>,
	page: number
): ProjectsQueryParams => {
	const params: ProjectsQueryParams = {};
	if (search.district) params.district = search.district;
	if (search.wildcard?.trim()) params.title = search.wildcard.trim();
	if (search.typologies?.length) params.typologies = search.typologies;
	if (search.assignmentStatus?.length) params.assignmentStatuses = search.assignmentStatus;
	if (search.constructionStatus?.length) params.constructionStatuses = search.constructionStatus;
	if (search.priceRange?.length === 2) {
		params.priceMin = search.priceRange[0];
		params.priceMax = search.priceRange[1];
	}
	params.page = page;
	params.size = PROJECTS_PAGE_SIZE;
	return params;
};

export const fetchProjectsPage = async (
	history: boolean,
	params: ProjectsQueryParams,
	options?: RequestInit
): Promise<PageProjectListItemDTO> => {
	const fetcher = history ? getAllProjectsHistory : getAllProjectsCurrent;
	// customFetch resolves with the response body, not the { data, status } envelope orval types describe
	return (await fetcher(params, options)) as unknown as PageProjectListItemDTO;
};

// Without params, the key matches every cached page of that list (useful for invalidation)
export const getProjectsQueryKey = (history: boolean, params?: ProjectsQueryParams) =>
	history ? getGetAllProjectsHistoryQueryKey(params) : getGetAllProjectsCurrentQueryKey(params);

export const fetchFilterValues = async (options?: RequestInit): Promise<FilterValuesDTO> =>
	// customFetch resolves with the response body, not the { data, status } envelope orval types describe
	(await getFilterValues(options)) as unknown as FilterValuesDTO;

// The price slider always starts at 0; without any priced typology there's no upper bound to offer
export const filterValuesToPriceRange = (filterValues?: FilterValuesDTO | null): number[] => [
	0,
	filterValues?.price ?? 0
];

export const filterValuesToTypologies = (filterValues?: FilterValuesDTO | null): string[] =>
	[...(filterValues?.typologies ?? [])].sort((a, b) =>
		a.localeCompare(b, undefined, { numeric: true })
	);

export const searchParamsToQuery = (search: SearchParams): Record<string, string> => {
	const query: Record<string, string> = {};
	if (search.wildcard) query.q = search.wildcard;
	if (search.district) query.district = search.district;
	if (search.assignmentStatus.length > 0)
		query.assignmentStatus = search.assignmentStatus.join(',');
	if (search.constructionStatus.length > 0)
		query.constructionStatus = search.constructionStatus.join(',');
	if (search.priceRange.length === 2) {
		query.priceMin = String(search.priceRange[0]);
		query.priceMax = String(search.priceRange[1]);
	}
	if (search.typologies.length > 0) query.typologies = search.typologies.join(',');
	return query;
};

export const queryToSearchParams = (query: ParsedUrlQuery): Partial<SearchParams> => {
	const partial: Partial<SearchParams> = {};
	if (typeof query.q === 'string') partial.wildcard = query.q;
	if (typeof query.district === 'string') partial.district = query.district;
	else partial.district = '';
	if (typeof query.assignmentStatus === 'string')
		partial.assignmentStatus = query.assignmentStatus.split(',') as AssignmentStatusType[];
	if (typeof query.constructionStatus === 'string')
		partial.constructionStatus = query.constructionStatus.split(',') as ConstructionStatusType[];
	if (typeof query.priceMin === 'string' && typeof query.priceMax === 'string') {
		const min = Number(query.priceMin);
		const max = Number(query.priceMax);
		if (!isNaN(min) && !isNaN(max)) partial.priceRange = [min, max];
	}
	if (typeof query.typologies === 'string') partial.typologies = query.typologies.split(',');
	return partial;
};

export const isSameQuery = (query: Record<string, string>, current: ParsedUrlQuery): boolean => {
	const keys = Object.keys(query);
	return (
		keys.length === Object.keys(current).length && keys.every((key) => current[key] === query[key])
	);
};

// The URL holds a 1-based page number, the API expects a 0-based index
export const pageToQuery = (page: number): Record<string, string> =>
	page > 0 ? { page: String(page + 1) } : {};

export const queryToPage = (query: ParsedUrlQuery): number => {
	const page = Number(query.page);
	return Number.isInteger(page) && page > 1 ? page - 1 : 0;
};

export const queryToApiParams = (query: ParsedUrlQuery): ProjectsQueryParams =>
	searchParamsToApiParams(queryToSearchParams(query), queryToPage(query));
