import mongoose from "mongoose";

const report = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
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
    location: {
        type: String,
        required: true
    }
}); 

export const ReportModel = mongoose.models.Report || mongoose.model("Report", report);

