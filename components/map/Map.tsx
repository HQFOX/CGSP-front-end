import styled from "@emotion/styled";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import RoomIcon from '@mui/icons-material/Room';
import { LatLngTuple, divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import theme from "../../theme";

interface MapProps {
    centerCoordinates: LatLngTuple,
    markers?: LatLngTuple[],
    zoom?: number,
}

const StyledMarker = styled(Marker)({

})

const iconMarkup = renderToStaticMarkup(
    <RoomIcon style={{ color: theme.palette.primary.main, fontSize: 50, position: "absolute", top: "-27px", left: "-20px" }}/>
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup
  });



const Map = ({ centerCoordinates, markers, zoom = 13 }: MapProps) => {

    const username = "hqfox"

    const access_token = ""

    const style_id = "cljkcualr006l01r56lm1139x"

    const url = `https://api.mapbox.com/styles/v1/${username}/${style_id}/tiles/256/{z}/{x}/{y}@2x?access_token=${access_token}`



    return (
        <MapContainer center={centerCoordinates} zoom={zoom} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                url={url}

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