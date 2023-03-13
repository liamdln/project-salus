import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { readSettings, saveSettings } from '../../../lib/settings'
import dbConnect from '../../../lib/dbConnect'
import { Settings } from '../../../types/settings'
import { UserPower } from "../../../config/user"

export default async function handler(req: NextApiRequest, res: NextApiResponse<Settings | Record<string, any>>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }
    // permissions
    if ((token.userPower || 0) < UserPower.MEMBER) {
        return res.status(403).json({ error: "You are not authorized to access this endpoint." })
    }

    // connect to the database
    await dbConnect();
    
    switch (req.method) {

        case "POST":
            if ((token.userPower || 0) < UserPower.ADMIN) {
                return res.status(403).json({ error: "You are not authorized to access this endpoint." })
            }

            try {
                const body = req.body;
                if (!body.id || !body.payload) {
                    return res.status(400).json({ error: "Either the document ID or settings were not sent. Structure must follow: { id: <mongodb document ID>, payload: <settings type payload> }" })
                }
                const newSettings = await saveSettings(body.id, body.payload);
                return res.status(200).json({ status: "success", body: newSettings });
            } catch (e) {
                console.log(e);
                return res.status(500).json({ error: "Could not post settings." })
            }

        case "GET":
            const settings = await readSettings();
            if (!settings) {
                return res.status(500).json({ error: "Settings could not be loaded." })
            }

            return res.status(200).json(settings);
        
        default:
            return res.status(405).json({ error: `${req.method} request not allowed on this endpoint.` });

    }  

}
