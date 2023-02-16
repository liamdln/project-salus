import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, postComment, updateReportSeverity, updateReportStatus } from '../../../lib/reports';
import { Comment, Report } from '../../../types/reports';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report | { status: string, body?: string } | { error: string, message?: string }>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }
    // check perms

    await dbConnect();
    const query = req.query

    switch (req.method) {

        case "POST":
            const context = query.context;
            if (!query.id) {
                return res.status(400).json({ error: "No report ID was sent." })
            }
            if (context === "comment") {
                try {
                    const body = req.body;
                    const refreshedReport = await postComment(query.id, body);
                    return res.status(200).json({ status: "success", body: refreshedReport.comments });
                } catch (e) {
                    console.log(e);
                    return res.status(500).json({ error: "Could not post comment." })
                }
            } else if (context === "severity") {
                try {
                    const body = req.body;
                    const refreshedReport = await updateReportSeverity(query.id, body);
                    return res.status(200).json({ status: "success", body: refreshedReport.severity });
                } catch (e) {
                    console.log(e);
                    return res.status(500).json({ error: "Could not update severity." })
                }
            } else if (context === "status") {
                try {
                    const body = req.body;
                    const refreshedReport = await updateReportStatus(query.id, body);
                    return res.status(200).json({ status: "success", body: refreshedReport.status });
                } catch (e) {
                    console.log(e);
                    return res.status(500).json({ error: "Could not update status." })
                }
            }
            // else
            return res.status(400).json({ error: "POST context was not provided." })

        case "GET":
        default:
            try {
                const report = await getReportsAsync({ _id: query.id });
                return res.status(200).json(report[0]);
            } catch (e) {
                return res.status(404).json({ error: `Could not find report id ${query.id}` })
            }

    }

}