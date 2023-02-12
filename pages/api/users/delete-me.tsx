import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Record<string, any>>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }
    // check perms

    await dbConnect();

    switch (req.method) {

        case "POST":
        default:
            const body = JSON.parse(req.body);
            try {
                return res.status(200).json({ status: "success" })
            } catch (e) {
                console.log("Error: ", e);
                return res.status(500).json({ status: "error", message: "Could not delete user." })
            }
        
    }

}