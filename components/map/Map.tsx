import React, { ReactNode } from 'react';
import {
  MapContainer,
  MapContainerProps,
  Pane,
  Polygon,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet';

import { LatLngExpression, LatLngTuple } from 'leaflet';

import { ProjectCardPopUp } from '../projects/ProjectCardPopUp';
import { CGSPMarker } from './Marker';
import { Beja } from './districtdata/Beja';
import { Evora } from './districtdata/Evora';
import { Portalegre } from './districtdata/Portalegre';

interface MapProps extends MapContainerProps {
  centerCoordinates: LatLngTuple;
  markers?: LatLngTuple[];
  projects?: Project[];
  onCoordinateChange?: (values: LatLngTuple) => void;
  currentDistrict?: string;
  changeView?: boolean;
  draggable?: boolean;
  popupContent?: ReactNode;
}

const ChangeView = ({
  centerCoordinates,
  zoom
}: {
  centerCoordinates: LatLngTuple;
  zoom?: number;
}) => {
  const map = useMap();
  map.setView(centerCoordinates, zoom);

  return null;
};

const renderPanel = (district?: string) => {
  switch (district) {
    case 'Évora':
      return (
        <Polygon
          positions={
            Evora.geojson.geometry.coordinates[0].map((innerArray) =>
              innerArray.slice().reverse()
            ) as LatLngExpression[]
          }
          pathOptions={{ color: '#FF7F51', fillColor: '#48bce5' }}
        />
      );
    case 'Beja':
      return (
        <Polygon
          positions={
            Beja.geojson.geometry.coordinates[0].map((innerArray) =>
              innerArray.slice().reverse()
            ) as LatLngExpression[]
          }
          pathOptions={{ color: '#FF7F51', fillColor: '#48bce5' }}
        />
      );
    case 'Portalegre':
      return (
        <Polygon
          positions={
            Portalegre.geojson.geometry.coordinates[0].map((innerArray) =>
              innerArray.slice().reverse()
            ) as LatLngExpression[]
          }
          pathOptions={{ color: '#FF7F51', fillColor: '#48bce5' }}
        />
      );
    default:
      return <></>;
  }
};

const Map = ({
  centerCoordinates,
  markers = [],
  projects = [],
  onCoordinateChange = () => {},
  currentDistrict,
  changeView = false,
  scrollWheelZoom = false,
  draggable = false,
  popupContent = undefined,
  ...others
}: MapProps) => {
  const username = 'hqfox';

  const access_token =
    'pk.eyJ1IjoiaHFmb3giLCJhIjoiY2xqbGtyNHUwMDUxdzNvcjFtNXQycmNjYSJ9.EFl0rmIyhCBfY5AMiss-UQ';

  const style_id = 'cljkcualr006l01r56lm1139x';

  const url = `https://api.mapbox.com/styles/v1/${username}/${style_id}/tiles/256/{z}/{x}/{y}@2x?access_token=${access_token}`;

  const ClickListener = () => {
    useMapEvents({
      dblclick: (e) => {
        onCoordinateChange([e.latlng.lat, e.latlng.lng]);
      }
    });
    return null;
  };

  return (
    <MapContainer
      center={centerCoordinates}
      scrollWheelZoom={scrollWheelZoom}
      style={{ width: '100%', height: '100%' }}
      {...others}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={url}
      />
      {changeView && <ChangeView centerCoordinates={centerCoordinates} />}
      {markers.map((marker, index) => (
        <CGSPMarker
          coordinates={marker}
          key={index}
          draggable={draggable}
          setCoordinates={onCoordinateChange}
        >
          {popupContent}
        </CGSPMarker>
      ))}
      {projects.map((project, index) => (
        <CGSPMarker key={index} coordinates={project.coordinates as LatLngTuple}>
          <ProjectCardPopUp project={project} />
        </CGSPMarker>
      ))}
      <Pane name="districts">{renderPanel(currentDistrict)}</Pane>
      <ClickListener />
    </MapContainer>
  );
};

export default Map;
