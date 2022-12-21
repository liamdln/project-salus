import type { NextApiRequest, NextApiResponse } from 'next'
import { readSettings } from '../../config/settings'
import { Settings } from '../../types/settings'

export default async function handler(req: NextApiRequest, res: NextApiResponse<Settings>) {

    const settings = await readSettings();
    res.status(200).json(settings);

}
