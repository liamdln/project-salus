import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, submitReport } from '../../../lib/reports';
import { Report } from '../../../types/reports';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report[] | Report | { status: string, message?: string } | { error: string }>) {

    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ error: "You are not logged in." })
    }
    // check perms

    await dbConnect();

    switch (req.method) {

        case "POST":
            const body = JSON.parse(req.body);
            console.log(body);
            try {
                submitReport(body);
                res.status(200).json({ status: "success" })
            } catch (e) {
                console.log("Error: ", e);
                res.status(500).json({ status: "error", message: "Could not create report." })
            }
            break;
            
        case "GET":
        default:
            const reports = await getReportsAsync();
            res.status(200).json(reports);
            break;

    }

}