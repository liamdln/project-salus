import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { readSettings } from '../../../config/settings'
import dbConnect from '../../../lib/dbConnect'
import { Settings } from '../../../types/settings'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Settings | Record<string, string>>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }

    // connect to the database
    await dbConnect();

    const settings = await readSettings();
    if (!settings) {
        return res.status(400).json({ error: "Settings could not be loaded." })
    }

    return res.status(200).json(settings);

}
