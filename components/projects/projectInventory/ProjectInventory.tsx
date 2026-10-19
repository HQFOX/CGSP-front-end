import React, { useEffect, useMemo, useState } from 'react';

import type { LatLngTuple } from 'leaflet';

import { Box, Fade, Grid, Pagination } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next/pages';
import { useRouter } from 'next/router';

import { PageProjectListItemDTO } from '../../../api/model';
import { Controls } from '../../controls/Controls';
import { DynamicMap } from '../../map/DynamicMap';
import ProjectCard from '../ProjectCard';
import {
	DISTRICT_OPTIONS,
	PRICE_RANGE_BOUNDS,
	ProjectsQueryParams,
	SearchParams,
	TYPOLOGY_OPTIONS,
	ViewType,
	districtCenterCoordinates,
	fetchProjectsPage,
	getProjectsQueryKey,
	isSameQuery,
	pageToQuery,
	queryToPage,
	queryToSearchParams,
	searchParamsToApiParams,
	searchParamsToQuery
} from './utils';

const DEFAULT_CENTER_COORDINATES: LatLngTuple = [38.56633674453089, -7.925327404275489];

const SEARCH_DEBOUNCE_MS = 300;

export interface ProjectInventoryProps {
	initialPage?: PageProjectListItemDTO;
	initialParams?: ProjectsQueryParams;
	history?: boolean;
}

export const ProjectInventory = ({
	initialPage,
	initialParams,
	history = false
}: ProjectInventoryProps) => {
	const router = useRouter();

	const { t } = useTranslation(['projectpage', 'common']);

	// Pages using this component are server-side rendered, so router.query is
	// already populated on the first render and matches the initial params.
	const [search, setSearch] = useState<SearchParams>(() => ({
		title: '',
		district: '',
		assignmentStatus: [],
		constructionStatus: [],
		priceRange: [],
		typologies: [],
		types: [],
		wildcard: '',
		...queryToSearchParams(router.query)
	}));

	const [page, setPage] = useState<number>(() => queryToPage(router.query));

	// The search box updates search.wildcard on every keystroke; the API is only
	// queried once typing settles.
	const [titleFilter, setTitleFilter] = useState<string>(search.wildcard);

	const [animationStart, setAnimationStart] = useState(false);

	const [view, setView] = useState<ViewType>(() =>
		typeof router.query.view === 'string' ? (router.query.view as ViewType) : 'card'
	);

	const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple>(
		() => districtCenterCoordinates[search.district] ?? DEFAULT_CENTER_COORDINATES
	);

	const [zoom, setZoom] = useState<number>(() =>
		districtCenterCoordinates[search.district] ? 9 : 6
	);

	useEffect(() => {
		if (search.wildcard === titleFilter) return;
		const timeout = setTimeout(() => {
			setTitleFilter(search.wildcard);
			setPage(0);
		}, SEARCH_DEBOUNCE_MS);
		return () => clearTimeout(timeout);
	}, [search.wildcard, titleFilter]);

	// Sync state changes to URL without a full navigation. Only replace when the
	// URL actually differs, so mounting (or remounting) never triggers a navigation.
	useEffect(() => {
		const query: Record<string, string> = { ...searchParamsToQuery(search), ...pageToQuery(page) };
		if (view !== 'card') query.view = view;
		if (isSameQuery(query, router.query)) return;
		router.replace({ query }, undefined, { shallow: true });
	}, [search, view, page]);

	const params = useMemo(
		() => searchParamsToApiParams({ ...search, wildcard: titleFilter }, page),
		[search, titleFilter, page]
	);

	const isInitialParams = JSON.stringify(params) === JSON.stringify(initialParams);

	const { data, isPlaceholderData } = useQuery({
		queryKey: getProjectsQueryKey(history, params),
		queryFn: ({ signal }) => fetchProjectsPage(history, params, { signal }),
		initialData: isInitialParams ? initialPage : undefined,
		placeholderData: keepPreviousData,
		staleTime: 60 * 1000
	});

	const projects = (data?.content ?? []) as Project[];
	const totalPages = data?.totalPages ?? 0;

	const handleClick = (projectId: string) => {
		router.push(`projects/${projectId}`);
	};

	useEffect(() => {
		setAnimationStart(true);
	}, [data]);

	const onDistrictChange = (district: string) => {
		const value = district === t('allm') ? '' : district;
		setSearch((search) => ({ ...search, district: value }));
		setPage(0);
		setCenterCoordinates(districtCenterCoordinates[value] ?? DEFAULT_CENTER_COORDINATES);
		setZoom(districtCenterCoordinates[value] == undefined ? 6 : 9);
	};

	const onViewChange = (view: ViewType) => {
		setView(view);
	};

	const onStatusChange = (status: string) => {
		switch (status) {
			case t('status.completed'):
				setSearch((search) => ({ ...search, status: 'completed' }));
				break;
			case t('status.building'):
				setSearch((search) => ({ ...search, status: 'building' }));
				break;
			case t('status.open'):
				setSearch((search) => ({ ...search, status: 'open' }));
				break;
			default:
				setSearch((search) => ({ ...search, status: t('allm') }));
		}
	};

	const onWildCardChange = (wildcard: string) => {
		setSearch((search) => ({ ...search, wildcard: wildcard }));
	};

	const onApply = (draft: SearchParams) => {
		setSearch((search) => ({
			...search,
			assignmentStatus: draft.assignmentStatus,
			constructionStatus: draft.constructionStatus,
			priceRange: draft.priceRange,
			typologies: draft.typologies
		}));
		setPage(0);
	};

	const onClear = () => {
		setSearch((search) => ({
			...search,
			assignmentStatus: [],
			constructionStatus: [],
			priceRange: [],
			typologies: []
		}));
		setPage(0);
	};

	const onPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value - 1);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<>
			<Controls
				search={{ ...search, district: search.district || t('allm') }}
				view={view}
				districts={[t('allm'), ...DISTRICT_OPTIONS]}
				priceRange={PRICE_RANGE_BOUNDS}
				typologies={TYPOLOGY_OPTIONS}
				onWildCardChange={onWildCardChange}
				onViewChange={onViewChange}
				onStatusChange={history ? undefined : onStatusChange}
				onDistrictChange={onDistrictChange}
				onApply={onApply}
				onClear={onClear}
			/>
			<Box sx={{ opacity: isPlaceholderData ? 0.5 : 1, transition: 'opacity 200ms' }}>
				<Grid container>
					{view === 'card' &&
						projects.map((project, i) => (
							<Fade
								key={project.id}
								in={animationStart}
								style={{ transitionDelay: animationStart ? `${i}00ms` : '0ms' }}
								unmountOnExit>
								<Grid size={{ xs: 12, md: 6 }} p={1} onClick={() => handleClick(project.id)}>
									<ProjectCard key={project.id} project={project} />
								</Grid>
							</Fade>
						))}
				</Grid>
				{view === 'map' && (
					<div id="map" style={{ height: 480, padding: '8px' }}>
						<DynamicMap
							centerCoordinates={centerCoordinates}
							projects={projects}
							zoom={zoom}
							currentDistrict={search.district}
							changeView
						/>
					</div>
				)}
			</Box>
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
					<Pagination
						count={totalPages}
						page={page + 1}
						onChange={onPageChange}
						color="primary"
						disabled={isPlaceholderData}
					/>
				</Box>
		</>
	);
};

export { districtCenterCoordinates };
