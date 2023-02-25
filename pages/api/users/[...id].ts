import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getUsers } from '../../../lib/users';
import { UserPower } from "../../../lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<User | { status: string, message?: string } | { error: string }>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }
    
    // permissions - make sure not public
    if ((token.userPower || 0) < UserPower.MEMBER) {
        return res.status(403).json({ error: "You are not authorized to access this endpoint." })
    }

    await dbConnect();

    switch (req.method) {

        case "GET":
        default:
            const query = req.query
            try {
                const user = await getUsers({ _id: query.id });
                return res.status(200).json(user[0]);
            } catch (e) {
                return res.status(404).json({ status: "error", message: `Could not find user with id ${query.id}` })
            }

    }

}