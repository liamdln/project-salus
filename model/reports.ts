import mongoose from "mongoose";

const report = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    }
}); 

export const ReportModel = mongoose.models.Report || mongoose.model("Report", report);

