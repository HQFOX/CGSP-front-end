import React, { useEffect, useMemo, useState } from 'react';

import { LatLngTuple } from 'leaflet';

import { Fade, Grid } from '@mui/material';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Controls } from '../../controls/Controls';
import { Beja, Evora, Portalegre } from '../../map/districtdata';
import { Setubal } from '../../map/districtdata/Setubal';
import ProjectCard from '../ProjectCard';
import {
  SearchParams,
  ViewType,
  getPriceRange,
  getTypes,
  getTypologies,
  normalizeString
} from './utils';

const Map = dynamic(() => import('../../map/Map'), {
  ssr: false
});

export interface ProjectInventoryProps {
  projects: Project[];
  history?: boolean;
}

export const districtCenterCoordinates: { [key: string]: LatLngTuple } = {
  Évora: Evora.geojson.properties.centros.centro.reverse() as LatLngTuple,
  Beja: Beja.geojson.properties.centros.centro.reverse() as LatLngTuple,
  Portalegre: Portalegre.geojson.properties.centros.centro.reverse() as LatLngTuple,
  Setúbal: Setubal.geojson.properties.centros.centro.reverse() as LatLngTuple
};

const constructionStatusValues: ConstructionStatusType[] = [
  'ALLOTMENTPERMIT',
  'BUILDINGPERMIT',
  'CONCLUDED'
];

const assignmentStatusValues: AssignmentStatusType[] = ['WAITING', 'ONGOING', 'CONCLUDED'];

export const ProjectInventory = ({ projects = [], history = false }: ProjectInventoryProps) => {
  const router = useRouter();

  const { t } = useTranslation(['projectpage', 'common']);

  const [search, setSearch] = useState<SearchParams>({
    title: '',
    district: t('allm'),
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

  const handleClick = (projectId: string) => {
    router.push(`projects/${projectId}`);
  };

  useEffect(() => {
    setAnimationStart(true);
  }, [projectSearchResults]);

  const filterResultsByLocation = (district: string, projects: Project[]): Project[] => {
    let result: Project[] = projects;
    if (district !== t('allm')) {
      result = projects.filter((project) =>
        project.district?.toLowerCase().includes(district.toLowerCase())
      );
      return result;
    }
    return result;
  };

  const filterResultsByTitle = (param: string, projects: Project[]) => {
    let result: Project[] = projects;
    if (param !== '') {
      result = projects.filter((project) =>
        normalizeString(project.title.toLowerCase()).includes(normalizeString(param.toLowerCase()))
      );
    }
    return result;
  };

  const filterResultsByWildCard = (param: string, projects: Project[]) => {
    let result: Project[] = projects;
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
      result = resultTitle.concat(resultLocation);
    }
    return result;
  };

  const filterResultsByPrice = (param: number[], projects: Project[]) =>
    projects.filter((project) =>
      project.typologies
        ? project.typologies?.filter(
            (typology) =>
              !typology.price || (typology.price >= param[0] && typology.price <= param[1])
          ).length > 0
        : false
    );

  const filterResultsByTypology = (param: string[], projects: Project[]) =>
    projects.filter(
      (project) =>
        project.typologies &&
        project.typologies.some(
          (typology) => typology.typology && param.includes(typology.typology)
        )
    );

  const filterResultsByAssignmentStatus = (param: string[], projects: Project[]) =>
    projects.filter(
      (project) => project.assignmentStatus && param.includes(project.assignmentStatus)
    );
  const filterResultsByConstructionStatus = (param: string[], projects: Project[]) =>
    projects.filter(
      (project) => project.constructionStatus && param.includes(project.constructionStatus)
    );

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

  const districts = (projectData: Project[]): string[] => {
    const districtSet: string[] = [t('allm')];
    projectData.map((project) => {
      if (project.district && !districtSet.includes(project.district)) {
        districtSet.push(project.district);
      }
    });
    return districtSet;
  };

  const onDistrictChange = (district: string) => {
    setSearch((search) => ({ ...search, district: district }));
    setCenterCoordinates(
      districtCenterCoordinates[district] ?? [38.56633674453089, -7.925327404275489]
    );
    setZoom(districtCenterCoordinates[district] == undefined ? 6 : 9);
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

  const onPriceRangeChange = (checked: boolean, range?: number[]) => {
    if (checked && range) setSearch((search) => ({ ...search, priceRange: range }));
    else {
      setSearch((search) => ({ ...search, priceRange: [] }));
    }
  };

  const onWildCardChange = (wildcard: string) => {
    setSearch((search) => ({ ...search, wildcard: wildcard }));
  };

  const onTypologyChange = (param: string, checked: boolean, type: 'typologies' | 'types') => {
    if (param == 'all') {
      if (!checked) {
        setSearch((search) => ({ ...search, typologies: [] }));
        setSearch((search) => ({ ...search, types: [] }));
      } else {
        setSearch((search) => ({ ...search, typologies: getTypologies(projects) }));
        setSearch((search) => ({ ...search, types: getTypes(projects) }));
      }
    } else {
      if (!checked) {
        setSearch((search) => ({
          ...search,
          [type]: search[type].filter((value) => value !== param)
        }));
      } else {
        setSearch((search) => ({ ...search, [type]: [...search[type], param] }));
      }
    }
  };

  const onAssignmentStatusChange = (param: AssignmentStatusType | 'all', checked: boolean) => {
    if (param == 'all') {
      if (!checked) {
        setSearch((search) => ({ ...search, assignmentStatus: [] }));
      } else {
        setSearch((search) => ({ ...search, assignmentStatus: assignmentStatusValues }));
      }
    } else {
      if (!checked) {
        setSearch((search) => ({
          ...search,
          assignmentStatus: search.assignmentStatus.filter((value) => value !== param)
        }));
      } else {
        setSearch((search) => ({
          ...search,
          assignmentStatus: [...search.assignmentStatus, param]
        }));
      }
    }
  };

  const onConstructionStatusChange = (param: ConstructionStatusType | 'all', checked: boolean) => {
    if (param == 'all') {
      if (!checked) {
        setSearch((search) => ({ ...search, constructionStatus: [] }));
      } else {
        setSearch((search) => ({ ...search, constructionStatus: constructionStatusValues }));
      }
    } else {
      if (!checked) {
        setSearch((search) => ({
          ...search,
          constructionStatus: search.constructionStatus.filter((value) => value !== param)
        }));
      } else {
        setSearch((search) => ({
          ...search,
          constructionStatus: [...search.constructionStatus, param]
        }));
      }
    }
  };

  return (
    <>
      <Controls
        search={search}
        view={view}
        districts={districts(projects)}
        priceRange={getPriceRange(projects)}
        typologies={getTypologies(projects)}
        types={getTypes(projects)}
        onWildCardChange={onWildCardChange}
        onViewChange={onViewChange}
        onStatusChange={history ? undefined : onStatusChange}
        onDistrictChange={onDistrictChange}
        onPriceRangeChange={onPriceRangeChange}
        onTypologyChange={onTypologyChange}
        onAssignmentStatusChange={onAssignmentStatusChange}
        onConstructionStatusChange={onConstructionStatusChange}
      />
      <Grid container>
        {view === 'card' &&
          projectSearchResults.map((project, i) => (
            <Fade
              key={project.id}
              in={animationStart}
              style={{ transitionDelay: animationStart ? `${i}00ms` : '0ms' }}
              unmountOnExit
            >
              <Grid item xs={12} md={6} p={1} onClick={() => handleClick(project.id)}>
                <ProjectCard key={project.id} project={project} />
              </Grid>
            </Fade>
          ))}
      </Grid>
      {view === 'map' && (
        <div id="map" style={{ height: 480, padding: '8px' }}>
          <Map
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
