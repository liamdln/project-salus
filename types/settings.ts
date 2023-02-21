export type Settings = {
    _id?: any,
    airport: {
        name: string,
        icao: string,
        iata: string
    }
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