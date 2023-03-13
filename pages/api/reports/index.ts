import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../lib/dbConnect";
import { getReportsAsync, submitReport } from '../../../lib/reports';
import nc from "next-connect";
import { checkInvalidPermissions } from "../../../lib/api";
import { UserPower } from "../../../config/user";

const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, _, res) => {
        console.error(err);
        return res.status(500).json({ error: "Could not create report." });
    },
    onNoMatch: (req, res) => {
        return res.status(405).json({ error: `${req.method} request not allowed on this endpoint.` });
    }
})

// permissions
handler.all(async (req, res, next) => {
    // check if user is logged in and permissions
    const invalidPermissions = await checkInvalidPermissions(req, UserPower.MEMBER)
    if (invalidPermissions) {
        return res.status(invalidPermissions.status).json({ error: invalidPermissions.message })
    }

    // connect to the database
    await dbConnect();

    // once handled, move onto the request (or no match handler)
    next();
})

handler.get(async (_, res) => {
    const reports = await getReportsAsync();
    return res.status(200).json(reports);
})

handler.post(async (req, res) => {
    const body = JSON.parse(req.body);
    try {
        await submitReport(body);
        return res.status(200).json({ status: "success" })
    } catch (e) {
        console.log("Error: ", e);
        throw e
        // return res.status(500).json({ status: "error", message: "Could not create report." })
    }
})

export default handler;