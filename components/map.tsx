import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useSWR from "swr";
import { fetcher } from "../lib/utils"
import { ReactNode } from 'react';

const Map = ({ children }: { children: ReactNode }) => {

    const { data, error } = useSWR('/api/all-settings', fetcher)

    if (error) {
        // swal?
        return <div>Failed to load the map. Please report this to the web administrator.</div>
    }
    else if (!data) {
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )
    } else {
        const mapSettings = data[0].map;

        return (
            <MapContainer center={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]} zoom={mapSettings.zoomLevel} scrollWheelZoom={true} style={{ height: 600, width: "100%", margin: "auto", color: "#000" }}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle center={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]} pathOptions={{ color: "green" }} radius={mapSettings.circleRadius} />
                {children}
            </MapContainer>
        )
    }
}

export default Map
