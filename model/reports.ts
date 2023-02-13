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
    authorId: {
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
    },
    date: {
        type: Date,
        required: true
    },
    comments: {
        type: {
            authorId: {
                type: String,
                required: false
            },
            content: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        },
        required: false
    }
});

export const ReportModel = mongoose.models.Report || mongoose.model("Report", report);

