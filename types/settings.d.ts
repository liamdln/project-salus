export type Settings = {
    map: {
        zoomLevel: number,
        xAxisCenter: number,
        yAxisCenter: number,
        config?: {
            minZoomLevel?: number,
            maxZoomLevel?: number
        }
    }
}