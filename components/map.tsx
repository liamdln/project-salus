import { MapContainer, TileLayer, Circle, Marker, Popup, FeatureGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useSWR from "swr";
import { fetcher } from "../lib/utils"
import { MapProps } from '../types/map';
import L, { Marker as LeafletMarker } from "leaflet";
import { useMemo, useRef } from 'react';

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

        const UserArea = () => {
            if (props.userArea) {
                return (
                    // Group the circle and popup
                    <FeatureGroup pathOptions={{ fillColor: props.userArea.fillColour, color: props.userArea.borderColour }}>
                        {/* Render the circle */}
                        <Circle
                            center={[props.userArea.centerLat, props.userArea.centerLng]}
                            radius={props.userArea.radius}
                            stroke={props.userArea.stroke}
                        />
                        {/* End render circle */}
                        {/* Render the popup if there is a message */}
                        {props.userArea.message ?
                            <Popup>
                                {props.userArea.message}
                            </Popup>
                            : <></>}
                        {/* End render popup */}
                    </FeatureGroup>
                    // End group and circle popup
                )
            } else {
                return (<></>)
            }
        }

        const ReportMarker = () => {
            if (props.reportMarker) {
                const markerRef = useRef<LeafletMarker>(null)
                const eventHandlers = useMemo(
                    () => ({
                        dragend() {
                            const marker = markerRef.current
                            if (marker != null) {
                                console.log(marker.getLatLng())
                                props.updateMarkerPosFunction(marker.getLatLng())
                            }
                        },
                    }),
                    [],
                )
                return (
                    <Marker draggable={true} position={[props.reportMarker.lat, props.reportMarker.lng]} eventHandlers={eventHandlers} ref={markerRef}>
                        <Popup>
                            Location of the Report
                        </Popup>
                    </Marker>
                )
            } else {
                return (<></>)
            }
        }

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
                    {/* End airport circle */}

                    {/* User Location Area (approx) */}
                    <UserArea />
                    {/* End User Area */}

                    {/* Report Marker */}
                    <ReportMarker />
                    {/* <ReportMarker /> */}
                    {/* End Report Marker */}

                </MapContainer>
            </>
        )
    }
}