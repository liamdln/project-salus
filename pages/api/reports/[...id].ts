import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, postComment, updateReportSeverity, updateReportStatus } from '../../../lib/reports';
import { Report } from '../../../types/reports';
import { UserPower } from "../../../lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report | { status: string, body?: string } | { error: string, message?: string }>) {

    // check logged in
    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }

    // permissions
    if ((token.userPower || 0) < UserPower.MEMBER) {
        return res.status(403).json({ error: "You are not authorized to access this endpoint." })
    }

    await dbConnect();
    const query = req.query

    switch (req.method) {

        case "POST":
            if (!query.id) {
                return res.status(400).json({ error: "No report ID was sent." })
            }
            try {
                const body = req.body;
                const refreshedReport = await postComment(query.id, body);
                return res.status(200).json({ status: "success", body: refreshedReport.comments });
            } catch (e) {
                console.log(e);
                return res.status(500).json({ error: "Could not post comment." })
            }

        case "PATCH":
            if (!query.id) {
                return res.status(400).json({ error: "No report ID was sent." })
            }
            const context = query.context;
            if (context === "severity") {
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
            } else {
                return res.status(400).json({ error: "PATCH context was not provided." })
            }

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