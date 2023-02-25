import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { createUser, getUsers } from '../../../lib/users';
import { UserPower } from "../../../lib/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<User[] | User | { status: string, message?: string } | { error: string }>) {

    const token = await getToken({ req })
    if (!token) {
        return res.status(401).json({ error: "You are not logged in." })
    }

    // make sure not public
    if ((token.userPower || 0) < UserPower.MEMBER) {
        return res.status(403).json({ error: "You are not authorized to access this endpoint." })
    }

    await dbConnect();

    switch (req.method) {

        case "POST":
            // only managers can create users
            if ((token.userPower || 0) < UserPower.MANAGER) {
                return res.status(403).json({ error: "You are not authorized to access this endpoint." })
            }
            const body = JSON.parse(req.body);
            try {
                await createUser(body);
                return res.status(200).json({ status: "success" })
            } catch (e) {
                console.log("Error: ", e);
                return res.status(500).json({ status: "error", message: "Could not create user." })
            }
            
        case "GET":
        default:
            const users = await getUsers();
            return res.status(200).json(users);

    }

}