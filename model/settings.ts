import mongoose from "mongoose";

const settings = new mongoose.Schema({
    airport: {
        name: {
            type: String,
            required: true
        },
        icao: {
            type: String,
            required: true
        },
        iata: {
            type: String,
            required: true
        }
    },
    map: { 
        zoomLevel: {
            type: Number,
            required: true,
        },
        xAxisCenter: {
            type: Number,
            required: true,
        },
        yAxisCenter: {
            type: Number,
            required: true,
        },
        circleRadius: {
            type: Number,
            required: true,
        },
        config: { 
            minZoomLevel: {
                type: Number,
                required: false,
            },
            maxZoomLevel: {
                type: Number,
                required: false,
            }
        }
    }
}); 

export const SettingsData = mongoose.models.Settings || mongoose.model("Settings", settings);

