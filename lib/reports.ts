import { ReportModel } from "../model/reports";
import { Report } from "../types/reports";

export async function getReports(filter?: Record<string, any>, returnFilter?: string): Promise<Report[]> {
    return ReportModel.find(filter || {}, returnFilter)
}

export async function getReportsAsync(filter?: Record<string, any>, returnFilter?: string): Promise<Report[]> {
    return await ReportModel.find(filter || {}, returnFilter).then((res: any) => {
        return res;
    }).catch(err => {
        console.log(err);
        throw new Error("Reports could not be read.");
    });
}

export function submitReport(report: Report) {
    const newReport = new ReportModel(report);
    return newReport.save((err: any) => {
        if (err) {
            console.log(err);
            throw new Error("Report could not be saved.");
        }
        return true;
    });
}