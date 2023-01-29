export type MapProps = {
    showHeatmap?: Boolean,
    markers?: MapMarker[],
    areas?: MapArea[]
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