import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { readSettings } from '../../../config/settings'
import dbConnect from '../../../lib/dbConnect'
import { Settings } from '../../../types/settings'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Settings | Record<string, string>>) {

    // connect to the database
    dbConnect();

    const token = await getToken({ req })
    if (!token) {
        res.status(401).json({ error: "You are not logged in." })
    }
    // check perms

    const settings = await readSettings();
    if (!settings) {
        res.status(400).json({ error: "Settings could not be loaded." })
    }
    
    res.status(200).json(settings);

}
