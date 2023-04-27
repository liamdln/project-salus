import { MapContainer, TileLayer, Circle, Marker, Popup, FeatureGroup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useSWR from "swr";
import { fetcher } from "../lib/api"
import { MapMarker, MapProps } from '../types/map';
import L, { Marker as LeafletMarker } from "leaflet";
import { useEffect, useMemo, useRef } from 'react';
import "leaflet.heat";

export default function Map(props: MapProps) {

    // code from React Leaflet: https://react-leaflet.js.org/docs/example-draggable-marker/
    // adapted for use by Liam P
    const markerRef = useRef<LeafletMarker>(null)
    const eventHandlers = useMemo(
        () => ({
            // listen for a drag event, once marker is dragged, get coordinates
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    props.updateMarkerPosFunction(marker.getLatLng())
                }
            },
        }),
        [props],
    )

    // get settings from API
    const { data, error, isLoading } = useSWR('/api/settings', fetcher)

    // error getting the data
    if (error) {
        return <div>Failed to load the map. Please report this to the web administrator.</div>
    } else if (isLoading) {
        // waiting for data
        return (
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )
    } else {
        // render map
        const mapSettings = data["map"];

        // marker image config
        let DefaultIcon = L.icon({
            iconUrl: "/restricted/images/leaflet/marker-icon.png",
            shadowUrl: "/restricted/images/leaflet/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -41]
        });
        // for some reason, the marker doesn't have an image
        // unless we configure it like the above
        L.Marker.prototype.options.icon = DefaultIcon;

        // Draws a ring around the user's approx location.
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

        // Draws a marker for a report.
        const ReportMarker = () => {
            if (props.reportMarker) {
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

        // Any custom markers that we may add.
        const CustomMarkers = () => {
            if (!props.markers) {
                return (<></>)
            }
            return (
                <>
                    {props.markers.map((marker: MapMarker, index: number) => {
                        return (
                            <Marker key={index} position={[marker.lat, marker.lng]}>
                                {marker.popupMessage ?
                                    <>
                                        <Popup>
                                            {marker.popupMessage}
                                        </Popup>
                                    </>
                                    :
                                    null
                                }
                            </Marker>
                        )
                    })}
                </>
            )
        }

        // when heatmap points are added, make a note so
        // that they are not added again when the state changes
        const handleHeatmapPointsAddedState = () => {
            props.setHeatmapPointsAdded(true);
        }

        // Heatmap
        const HeatmapLayer = () => {
            const map = useMap();
            useEffect(() => {
                if (!props.showHeatmap || !props.heatmapPoints || props.headMapPointsAdded) {
                    return;
                } else {
                    L.heatLayer(props.heatmapPoints, { radius: 15 }).addTo(map);
                    handleHeatmapPointsAddedState();
                }
            }, [map])
            return (<></>)
        }

        return (
            <>
                <MapContainer center={[props.mapCenter?.lat || mapSettings.xAxisCenter, props.mapCenter?.lng || mapSettings.yAxisCenter]}
                    zoom={mapSettings.zoomLevel}
                    scrollWheelZoom={true}
                    style={{ height: `${props.mapHeightPx || `700`}px`, width: "100%", margin: "auto", color: "#000" }}>
                    {/* Map Tiles */}
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Circle the airport */}
                    <Circle center={[mapSettings.xAxisCenter, mapSettings.yAxisCenter]}
                        pathOptions={{ color: "green", fillColor: "none" }}
                        radius={mapSettings.circleRadius} />
                    {/* End airport circle */}

                    {/* User Location Area (approx) */}
                    <UserArea />
                    {/* End User Area */}

                    {/* Report Marker */}
                    <ReportMarker />
                    {/* <ReportMarker /> */}

                    {/* Custom markers */}
                    <CustomMarkers />
                    {/* End custom markers */}

                    {/* Heatmap */}
                    <HeatmapLayer />
                    {/* End Heatmap */}
                    {/* End Report Marker */}

                </MapContainer>
            </>
        )
    }
}