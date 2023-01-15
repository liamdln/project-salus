import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import useSWR from "swr";
import { fetcher } from "../lib/utils"

const Map = () => {

    const { data, error } = useSWR('/api/all-settings', fetcher)

    if (error) return <div>Failed to load the map. Please report this to the web administrator.</div>
    if (!data) return (
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )

    const mapSettings = data[0].map;

    let DefaultIcon = L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>`,
        className: "",
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    return (
        <MapContainer center={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]} zoom={mapSettings.zoomLevel} scrollWheelZoom={true} style={{ height: 600, width: "100%", margin: "auto" }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map
