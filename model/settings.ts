import mongoose from "mongoose";

const settings = new mongoose.Schema({
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

