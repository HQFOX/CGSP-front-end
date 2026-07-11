import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { LatLngTuple } from 'leaflet';

import { Fade, Grid2 } from '@mui/material';
import { useTranslation } from 'next-i18next/pages';
import { useRouter } from 'next/router';

import { Controls } from '../../controls/Controls';
import { DynamicMap } from '../../map/DynamicMap';
import ProjectCard from '../ProjectCard';
import {
	SearchParams,
	ViewType,
	districtCenterCoordinates,
	filterResultsByAssignmentStatus,
	filterResultsByConstructionStatus,
	filterResultsByLocation,
	filterResultsByPrice,
	filterResultsByTitle,
	filterResultsByTypology,
	filterResultsByWildCard,
	getDistricts,
	getPriceRange,
	getTypes,
	getTypologies,
	queryToSearchParams,
	searchParamsToQuery
} from './utils';

export interface ProjectInventoryProps {
	projects: Project[];
	history?: boolean;
}

export const ProjectInventory = ({ projects = [], history = false }: ProjectInventoryProps) => {
	const router = useRouter();

	const { t } = useTranslation(['projectpage', 'common']);

	const [search, setSearch] = useState<SearchParams>({
		title: '',
		district: '',
		assignmentStatus: [],
		constructionStatus: [],
		priceRange: [],
		typologies: [],
		types: [],
		wildcard: ''
	});

	const [projectSearchResults, setProjectSearchResults] = useState<Project[]>(projects);

	const [animationStart, setAnimationStart] = useState(false);

	const [view, setView] = useState<ViewType>('card');

	const [centerCoordinates, setCenterCoordinates] = useState<LatLngTuple>([
		38.56633674453089, -7.925327404275489
	]);

	const [zoom, setZoom] = useState<number>(6);

	const isInitialized = useRef(false);

	// Initialize state from URL on first ready
	useEffect(() => {
		if (!router.isReady) return;
		const fromQuery = queryToSearchParams(router.query);
		if (Object.keys(fromQuery).length > 0) {
			setSearch((prev) => ({ ...prev, ...fromQuery }));
			if (fromQuery.district && fromQuery.district !== '') {
				setCenterCoordinates(
					districtCenterCoordinates[fromQuery.district] ?? [38.56633674453089, -7.925327404275489]
				);
				setZoom(districtCenterCoordinates[fromQuery.district] ? 9 : 6);
			}
		}
		if (typeof router.query.view === 'string') {
			setView(router.query.view as ViewType);
		}
		isInitialized.current = true;
	}, [router.isReady]);

	// Sync state changes to URL without a full navigation
	useEffect(() => {
		if (!isInitialized.current) return;
		const query: Record<string, string> = searchParamsToQuery(search);
		if (view !== 'card') query.view = view;
		router.replace({ query }, undefined, { shallow: true });
	}, [search, view]);

	const handleClick = (projectId: string) => {
		router.push(`projects/${projectId}`);
	};

	useEffect(() => {
		setAnimationStart(true);
	}, [projectSearchResults]);

	useMemo(() => {
		let results = projects;
		results = filterResultsByLocation(search.district, results);
		results = filterResultsByTitle(search.title, results);
		results = filterResultsByWildCard(search.wildcard, results);
		if (search.priceRange.length > 0) results = filterResultsByPrice(search.priceRange, results);
		if (search.typologies.length > 0) results = filterResultsByTypology(search.typologies, results);
		if (search.assignmentStatus.length > 0)
			results = filterResultsByAssignmentStatus(search.assignmentStatus, results);
		if (search.constructionStatus.length > 0)
			results = filterResultsByConstructionStatus(search.constructionStatus, results);
		setProjectSearchResults(results);
	}, [search, projects]);

	const onDistrictChange = (district: string) => {
		const value = district === t('allm') ? '' : district;
		setSearch((search) => ({ ...search, district: value }));
		setCenterCoordinates(
			districtCenterCoordinates[value] ?? [38.56633674453089, -7.925327404275489]
		);
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
			typologies: draft.typologies,
			types: draft.types
		}));
	};

	const onClear = () => {
		setSearch((search) => ({
			...search,
			assignmentStatus: [],
			constructionStatus: [],
			priceRange: [],
			typologies: [],
			types: []
		}));
	};

	return (
		<>
			<Controls
				search={{ ...search, district: search.district || t('allm') }}
				view={view}
				districts={getDistricts(projects, t('allm'))}
				priceRange={getPriceRange(projects)}
				typologies={getTypologies(projects)}
				types={getTypes(projects)}
				onWildCardChange={onWildCardChange}
				onViewChange={onViewChange}
				onStatusChange={history ? undefined : onStatusChange}
				onDistrictChange={onDistrictChange}
				onApply={onApply}
				onClear={onClear}
			/>
			<Grid2 container>
				{view === 'card' &&
					projectSearchResults.map((project, i) => (
						<Fade
							key={project.id}
							in={animationStart}
							style={{ transitionDelay: animationStart ? `${i}00ms` : '0ms' }}
							unmountOnExit>
							<Grid2 size={{ xs: 12, md: 6 }} p={1} onClick={() => handleClick(project.id)}>
								<ProjectCard key={project.id} project={project} />
							</Grid2>
						</Fade>
					))}
			</Grid2>
			{view === 'map' && (
				<div id="map" style={{ height: 480, padding: '8px' }}>
					<DynamicMap
						centerCoordinates={centerCoordinates}
						projects={projectSearchResults}
						zoom={zoom}
						currentDistrict={search.district}
						changeView
					/>
				</div>
			)}
		</>
	);
};
