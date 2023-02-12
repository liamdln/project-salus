import { HeatLatLngTuple, LatLng } from "leaflet";

export type MapProps = {
    showHeatmap?: Boolean,
    heatmapPoints?: (LatLng | HeatLatLngTuple)[],
    headMapPointsAdded?: boolean,
    setHeatmapPointsAdded?: any,
    markers?: MapMarker[],
    mapCenter?: { lat: number, lng: number }
    areas?: MapArea[],
    reportMarker?: MapMarker,
    userArea?: MapArea,
    updateMarkerPosFunction?: any
    mapHeightPx?: number;
}

export type MapMarker = {
    lat: number,
    lng: number,
    popupMessage?: string,
    draggable?: boolean,
}

export type MapArea = {
    borderColour: string,
    fillColour: string,
    stroke?: boolean
    radius: number,
    centerLat: number,
    centerLng: number,
    message?: string,
}