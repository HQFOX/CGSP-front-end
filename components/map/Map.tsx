import styled from "@emotion/styled";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"

//38.56633674453089, -7.925327404275489

const Map = () => {

    return (
        <MapContainer center={[38.56633674453089, -7.925327404275489]} zoom={13} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[38.56633674453089, -7.925327404275489]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map;