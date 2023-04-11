import styled from "@emotion/styled";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import RoomIcon from '@mui/icons-material/Room';
import { LatLngTuple, divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import theme from "../../theme";

interface MapProps {
    centerCoordinates: LatLngTuple,
    markers?: LatLngTuple[],
}

const iconMarkup = renderToStaticMarkup(
    <RoomIcon />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup
  });



const Map = ({ centerCoordinates, markers }: MapProps) => {

    return (
        <MapContainer center={centerCoordinates} zoom={13} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { markers && markers.map( marker => (
                <Marker position={marker} icon={customMarkerIcon}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    )
}

export default Map;