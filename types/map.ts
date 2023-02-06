export type MapProps = {
    showHeatmap?: Boolean,
    heatmapPoints?: HeatmapNode[],
    markers?: MapMarker[],
    areas?: MapArea[],
    reportMarker?: MapMarker,
    userArea?: MapArea,
    updateMarkerPosFunction?: any
    mapHeightPx?: number; 
}

export type HeatmapNode = {
    lat: number,
    lng: number,
    intensity: number
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