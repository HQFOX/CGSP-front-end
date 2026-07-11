import type { ParsedUrlQuery } from 'querystring';
import type { LatLngTuple } from 'leaflet';
import { Beja, Evora , Portalegre} from '../../map/districtdata';
import { Setubal } from '../../map/districtdata/Setubal';


export const normalizeString = (value: string): string => {
	return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

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

export const getPriceRange = (projects: Project[]) => {
	const priceRange: (number | undefined)[] = [undefined, undefined];

	projects.map((project) => {
		project.typologies?.map((typology) => {
			if (typology.price) {
				if (priceRange[0] == undefined || priceRange[0] > typology.price)
					priceRange[0] = typology.price;
				if (priceRange[1] == undefined || priceRange[1] < typology.price)
					priceRange[1] = typology.price;
			}
		});
	});
	return priceRange as number[];
};

export const getTypologies = (projects: Project[]) => {
	const typologies = new Set<string>();

	projects.map((project) => {
		project.typologies?.map((typology) => {
			if (typology.typology) {
				typologies.add(typology.typology);
			}
		});
	});

	return [...typologies];
};

export const getTypes = (projects: Project[]) => {
	const types = new Set<string>();

	projects.map((project) => {
		project.typologies?.map((typology) => {
			if (typology.type) {
				types.add(typology.type);
			}
		});
	});

	return [...types];
};

export const districtCenterCoordinates: { [key: string]: LatLngTuple } = {
	Évora: Evora.geojson.properties.centros.centro.reverse() as LatLngTuple,
	Beja: Beja.geojson.properties.centros.centro.reverse() as LatLngTuple,
	Portalegre: Portalegre.geojson.properties.centros.centro.reverse() as LatLngTuple,
	Setúbal: Setubal.geojson.properties.centros.centro.reverse() as LatLngTuple
};

export const constructionStatusValues: ConstructionStatusType[] = [
	'ALLOTMENTPERMIT',
	'BUILDINGPERMIT',
	'CONCLUDED'
];

export const assignmentStatusValues: AssignmentStatusType[] = ['WAITING', 'ONGOING', 'CONCLUDED'];

export const getDistricts = (projects: Project[], allDistrictsLabel: string): string[] => {
	const districtSet: string[] = [allDistrictsLabel];
	projects.map((project) => {
		if (project.district && !districtSet.includes(project.district)) {
			districtSet.push(project.district);
		}
	});
	return districtSet;
};

export const filterResultsByLocation = (
	district: string,
	projects: Project[]
): Project[] => {
	if (district !== '') {
		return projects.filter((project) =>
			project.district?.toLowerCase().includes(district.toLowerCase())
		);
	}
	return projects;
};

export const filterResultsByTitle = (param: string, projects: Project[]): Project[] => {
	if (param !== '') {
		return projects.filter((project) =>
			normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase()))
		);
	}
	return projects;
};

export const filterResultsByWildCard = (param: string, projects: Project[]): Project[] => {
	if (param !== '') {
		const resultTitle = projects.filter((project) =>
			normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase()))
		);
		const resultLocation = projects.filter(
			(project) =>
				project.district &&
				normalizeString(project.district.toLowerCase()).includes(
					normalizeString(param.toLowerCase())
				)
		);
		return resultTitle.concat(resultLocation);
	}
	return projects;
};

export const filterResultsByPrice = (param: number[], projects: Project[]): Project[] =>
	projects.filter((project) =>
		project.typologies
			? project.typologies.filter(
					(typology) =>
						!typology.price || (typology.price >= param[0] && typology.price <= param[1])
				).length > 0
			: false
	);

export const filterResultsByTypology = (param: string[], projects: Project[]): Project[] =>
	projects.filter(
		(project) =>
			project.typologies &&
			project.typologies.some((typology) => typology.typology && param.includes(typology.typology))
	);

export const filterResultsByAssignmentStatus = (
	param: string[],
	projects: Project[]
): Project[] =>
	projects.filter(
		(project) => project.assignmentStatus && param.includes(project.assignmentStatus)
	);

export const filterResultsByConstructionStatus = (
	param: string[],
	projects: Project[]
): Project[] =>
	projects.filter(
		(project) => project.constructionStatus && param.includes(project.constructionStatus)
	);

export const searchParamsToQuery = (
	search: SearchParams
): Record<string, string> => {
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
	if (search.types.length > 0) query.types = search.types.join(',');
	return query;
};

export const queryToSearchParams = (
	query: ParsedUrlQuery
): Partial<SearchParams> => {
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
	if (typeof query.types === 'string') partial.types = query.types.split(',');
	return partial;
};
