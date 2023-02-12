import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync } from '../../../lib/reports';
import { Report } from '../../../types/reports';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report[] | Report | { status: string, message?: string } | { error: string }>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }
    // check perms

    await dbConnect();

    switch (req.method) {

        case "GET":
        default:
            const query = req.query
            try {
                const report = await getReportsAsync({ "_id": query.id });
                return res.status(200).json(report);
            } catch (e) {
                return res.status(404).json({ status: "error", message: `Could not find report id ${query.id}` })
            }

    }

}