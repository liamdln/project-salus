import { useMemo, useRef, useState } from "react";
import { MapMarker } from "../types/map";
import { Marker as LeafletMarker } from "leaflet";
import { Marker, Popup } from "react-leaflet";

export default function DraggableMarker(props: { marker: MapMarker }) {
    const [markerLocation, setMarkerLocation] = useState({ lat: props.marker.lat, lng: props.marker.lng })

    const markerRef = useRef<LeafletMarker>(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setMarkerLocation(marker.getLatLng())
                }
            },
        }),
        [],
    )

    return (
        <Marker draggable={true} position={markerLocation} eventHandlers={eventHandlers} ref={markerRef}>
            <Popup>
                Location of the Report
            </Popup>
        </Marker>
    )
}