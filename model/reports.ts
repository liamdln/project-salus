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
        type: {
            name: {
                type: String,
                required: true
            },
            id: {
                type: String,
                default: "",
                required: false
            }
        },
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
        type: [{
            author: {
                type: {
                    name: {
                        type: String,
                        required: true
                    },
                    id: {
                        type: String,
                        default: "",
                        required: false
                    }
                },
                required: true
            },
            content: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            }
        }],
        default: [],
        required: false
    },
    imageDirectories: {
        type: [String],
        required: false
    }
});

export const ReportModel = mongoose.models.Report || mongoose.model("Report", report);

