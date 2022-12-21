import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

const Map = ({ settings }: any) => {

    const map = settings.map;

    let DefaultIcon = L.icon({
        iconUrl: "images/asterisk.svg"
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    return (
        <MapContainer center={[map.xAxisCenter, map.yAxisCenter]} zoom={map.zoomLevel} scrollWheelZoom={false} style={{ height: 600, width: "100%", margin: "auto" }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[map.xAxisCenter, map.yAxisCenter]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map
