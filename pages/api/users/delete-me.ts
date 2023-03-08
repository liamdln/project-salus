import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { UserPower } from "../../../lib/user-utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Record<string, any>>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }

    const body = JSON.parse(req.body);
    
    // permissions, make sure user is either admin or the user themselves
    if ((token.userPower || 0) < UserPower.ADMIN || token.sub !== body.userId) {
        return res.status(403).json({ error: "You are not authorized to access this endpoint." })
    }

    await dbConnect();

    switch (req.method) {

        case "POST":
        default:
            try {
                return res.status(200).json({ status: "success" })
            } catch (e) {
                console.log("Error: ", e);
                return res.status(500).json({ status: "error", message: "Could not delete user." })
            }
        
    }

}