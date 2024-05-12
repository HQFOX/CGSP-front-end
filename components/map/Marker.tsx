/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { ReactNode, useMemo, useRef } from "react";

import { ClassNames } from "@emotion/react";
import { LatLngTuple, divIcon } from "leaflet";
import { Marker, Popup, MarkerProps as LeafletMarkerProps } from "react-leaflet";

import RoomIcon from "@mui/icons-material/Room";

import { renderToStaticMarkup } from "react-dom/server";

import theme from "../../theme";

const iconMarkup = renderToStaticMarkup(
	<RoomIcon style={{ color: theme.palette.primary.main, fontSize: 50, position: "absolute", top: "-27px", left: "-20px" }}/>
);
const customMarkerIcon = divIcon({
	html: iconMarkup
});

const styles = {
	root: { 
		margin: 0,
		".leaflet-popup-content p" : {
			margin: 0,
		}
		 
	 }
};

export interface MarkerProps extends Omit<LeafletMarkerProps, "position"> {
    coordinates : LatLngTuple,
    draggable? : boolean,
    setCoordinates? : (position: LatLngTuple) => void,
    children? : ReactNode,
}


export const CGSPMarker = ({
	coordinates,
	draggable = false,
	setCoordinates = () => {},
	children,
	...others
}: MarkerProps) => {

	const markerRef = useRef(null);

	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				if (marker != null) {
					// @ts-ignore
					const LatLngTuple = marker.getLatLng();
					setCoordinates([LatLngTuple.lat, LatLngTuple.lng]);
				}
			}
		}),
		[],
	);

	return (
		<Marker position={coordinates} icon={customMarkerIcon} draggable={draggable} eventHandlers={eventHandlers} ref={markerRef} {...others}>
			<ClassNames>
				{({ css }) => (
					<Popup className={css(styles.root)}>
						{children}
					</Popup>
				)}
			</ClassNames>
		</Marker>
	);
};