import { ReportModel } from "../model/reports";
import { Report } from "../types/reports";
import dbConnect from "./dbConnect";

export async function getReports(filter?: Record<string, any>, returnFilter?: string): Promise<Report[]> {
    await dbConnect();
    return ReportModel.find(filter || {}, returnFilter)
}

export async function getReportsAsync(filter?: Record<string, any>, returnFilter?: string): Promise<Report[]> {
    await dbConnect();
    return await ReportModel.find(filter || {}, returnFilter).then((res: any) => {
        return res;
    }).catch(err => {
        console.log(err);
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

export async function updateReportStatus(reportId: string, update: { status: number }) {
    await dbConnect();
    return await ReportModel.findByIdAndUpdate(reportId, update).then((res: any) => {
        return res;
    }).catch((err) => {
        console.log(err);
        throw new Error("Could not update report status.")
    })
}