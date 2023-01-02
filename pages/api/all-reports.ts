import type { NextApiRequest, NextApiResponse } from 'next'
import { getReportsAsync } from '../../lib/reports';
import { Report } from '../../types/reports';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Report[]>) {

    const reports = await getReportsAsync();
    res.status(200).json(reports);

}
