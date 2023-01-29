import { MapContainer, TileLayer, Circle, Marker, Popup, FeatureGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useSWR from "swr";
import { fetcher } from "../lib/utils"
import L from 'leaflet';
import { MapArea, MapMarker, MapProps } from '../types/map';
import DraggableMarker from "./draggable-marker";

export default function Map(props: MapProps) {

    // TODO: only get map settings?
    const { data, error } = useSWR('/api/settings', fetcher)

    // error getting the data
    if (error) {
        // TODO: swal
        return <div>Failed to load the map. Please report this to the web administrator.</div>
    }
    else if (!data) {
        // waiting for data
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )
    } else {
        // render map
        const mapSettings = data["map"];

        let DefaultIcon = L.icon({
            iconUrl: "/images/leaflet/marker-icon.png",
            shadowUrl: "/images/leaflet/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41]
        });
        L.Marker.prototype.options.icon = DefaultIcon;

        return (
            <>
                <MapContainer center={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]} zoom={mapSettings.zoomLevel} scrollWheelZoom={true} style={{ height: 600, width: "100%", margin: "auto", color: "#000" }}>
                    {/* Map Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Circle the airport */}
                    <Circle center={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]} pathOptions={{ color: "green" }} radius={mapSettings.circleRadius} />

                    {/* User Location Area (approx) */}
                    {props.areas ? props.areas.map((area: MapArea, index: number) => {
                        return (
                            // Group the circle and popup
                            <FeatureGroup pathOptions={{ fillColor: area.fillColour, color: area.borderColour }}>
                                {/* Render the circle */}
                                <Circle
                                    key={index}
                                    center={[area.centerLat, area.centerLng]}
                                    radius={area.radius}
                                    stroke={area.stroke}
                                />
                                {/* End render circle */}
                                {/* Render the popup if there is a message */}
                                {area.message ?
                                    <Popup>
                                        {area.message}
                                    </Popup>
                                    : <></>}
                                {/* End render popup */}
                            </FeatureGroup>
                            // End group and circle popup
                        )
                    })
                        : <></>}

                    {/* Markers */}
                    {props.markers ? props.markers.map((marker: MapMarker, index: number) => {
                        if (marker.draggable) {
                            return (
                                <DraggableMarker key={index} marker={marker} />
                            )
                        } else {
                            return (
                                <Marker key={index} position={[marker.lat, marker.lng]}>
                                    {marker.popupMessage ?
                                        <Popup>
                                            {marker.popupMessage}
                                        </Popup>
                                        : <></>}
                                </Marker>
                            )
                        }
                    })
                        : <></>}

                </MapContainer>
            </>
        )
    }
}