import { ReportModel } from "../model/reports";
import { Comment, Report } from "../types/reports";
import dbConnect from "./dbConnect";

export async function getReports(filter?: Record<string, any>, returnFilter?: string): Promise<Report[]> {
    await dbConnect();
    return await ReportModel.find(filter || {}, returnFilter).then((res: any) => {
        return res;
    }).catch(err => {
        console.error(err);
        throw new Error("Reports could not be read.");
    });
}

export async function submitReport(report: Report) {
    await dbConnect();
    const newReport = new ReportModel(report);
    try {
        await newReport.save()
    } catch (e) {
        throw new Error(`Report could not be saved! Stack:\n${e}`)
    }
}

export async function updateReportStatus(reportId: string | string[], update: { status: number }) {
    await dbConnect();
    return await ReportModel.findByIdAndUpdate({ _id: reportId }, { $set: update }, { new: true }).then((res: any) => {
        return res;
    }).catch((err) => {
        console.error(err);
        throw new Error("Could not update report status.")
    })
}

export async function updateReportSeverity(reportId: string | string[], update: { severity: number }) {
    await dbConnect();
    return await ReportModel.findByIdAndUpdate({ _id: reportId }, { $set: update }, { new: true }).then((res: any) => {
        return res;
    }).catch((err) => {
        console.error(err);
        throw new Error("Could not update report severity.")
    })
}

export async function postComment(reportId: string | string[], comment: Comment) {
    await dbConnect();
    return await ReportModel.findByIdAndUpdate({ _id: reportId }, { $push: { comments: comment } }, { new: true }).then((res: any) => {
        return res;
    }).catch((err) => {
        console.error(err);
        throw new Error("Could not post comment.")
    })
}