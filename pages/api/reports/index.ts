import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, submitReport } from '../../../lib/reports';
import { Report } from '../../../types/reports';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report[] | Report | { status: string, message?: string }>) {

    dbConnect();

    switch (req.method) {

        case "POST":
            const body = req.body;
            console.log(body);
            try {
                submitReport(body);
                res.status(200).json({ status: "success" })
            } catch (e) {
                console.log(e);
                res.status(500).json({ status: "error", message: "Could not create report." })
            }
            
        case "GET":
        default:
            const reports = await getReportsAsync();
            res.status(200).json(reports);

    }

}