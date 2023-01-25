export type Settings = {
    map: {
        zoomLevel: number,
        xAxisCenter: number,
        yAxisCenter: number,
        circleRadius: number,
        config?: {
            minZoomLevel?: number,
            maxZoomLevel?: number
        }
    }
}