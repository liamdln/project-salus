import mongoose from "mongoose";

const settings = new mongoose.Schema({
    map: { 
        zoomLevel: {
            type: Number,
            required: true,
            unique: false
        },
        xAxisCenter: {
            type: Number,
            required: true,
            unique: false
        },
        yAxisCenter: {
            type: Number,
            required: true,
            unique: false
        },
        config: { 
            minZoomLevel: {
                type: Number,
                required: false,
                unique: false
            },
            maxZoomLevel: {
                type: Number,
                required: false,
                unique: false
            }
        }
    }
}); 

export const SettingsData = mongoose.models.Settings || mongoose.model("Settings", settings);

