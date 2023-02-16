import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, submitReport } from '../../../lib/reports';
import { Report } from '../../../types/reports';
import { UserPower } from "../../../lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report[] | Report | { status: string, message?: string } | { error: string }>) {

    // check user is logged in
    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }
    
    // permissions
    if (token.userPower < UserPower.MEMBER) {
        return res.status(403).json({ error: "You are not authorized to access this endpoint." })
    }

    await dbConnect();

    switch (req.method) {

        case "POST":
            const body = JSON.parse(req.body);
            try {
                await submitReport(body);
                return res.status(200).json({ status: "success" })
            } catch (e) {
                console.log("Error: ", e);
                return res.status(500).json({ status: "error", message: "Could not create report." })
            }
            
        case "GET":
        default:
            const reports = await getReportsAsync();
            return res.status(200).json(reports);

    }

}