import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, postComment } from '../../../lib/reports';
import { Comment, Report } from '../../../types/reports';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report | { status: string, res?: string } | { error: string, message?: string }>) {

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
                return res.status(400).json({ status: "error", message: "No report ID was sent." })
            }
            if (context === "comment") {
                try {
                    const body = req.body;
                    // only one ID sent, but sent as array so take first element
                    console.log("query: ", query.id)
                    console.log("body ", body)
                    const newComment = await postComment(query.id, body);
                    return res.status(200).json({ status: "success", res: JSON.stringify(newComment) });
                } catch (e) {
                    console.log(e);
                    return res.status(500).json({ status: "error", res: "Could not post comment." })
                }
            }
            // else
            return res.status(400).json({ status: "error", message: "POST context was not provided." })

        case "GET":
        default:
            try {
                const report = await getReportsAsync({ _id: query.id });
                return res.status(200).json(report[0]);
            } catch (e) {
                return res.status(404).json({ status: "error", message: `Could not find report id ${query.id}` })
            }

    }

}