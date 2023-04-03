import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { getUsers, updateUser } from '../../../lib/users';
import { UserPower } from "../../../config/user";
import bcrypt from "bcrypt"


export default async function handler(req: NextApiRequest, res: NextApiResponse<User | { status: string, body?: string } | { error: string }>) {

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

        case "PATCH":
            // only managers can create users
            if ((token.userPower || 0) < UserPower.MANAGER) {
                return res.status(403).json({ error: "You are not authorized to access this endpoint." })
            }
            const body = req.body;

            if (body.payload.password) {
                const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS || "10");
                await bcrypt.hash(body.payload.password, saltRounds)
                    .then((hash) => {
                        body.payload.encryptedPassword = hash;
                        delete body.payload.password;
                    })
                    .catch(() => res.status(500).json({ error: "Could not update user." }));
            }
            return await tryUpdateUser(res, body);

        case "GET":
            const query = req.query
            try {
                const user = await getUsers({ _id: query.id });
                return res.status(200).json(user[0]);
            } catch (e) {
                return res.status(404).json({ error: `Could not find user with id ${query.id}` })
            }

        default:
            return res.status(405).json({ error: `${req.method} request not allowed on this endpoint.` });

    }

}

async function tryUpdateUser(res: NextApiResponse<User | { status: string, body?: string } | { error: string }>, body: Record<string, any>) {
    try {
        const updatedUser = await updateUser(body.userId, body.payload);
        return res.status(200).json({ status: "success", body: updatedUser });
    } catch (e) {
        console.error("Error: ", e);
        return res.status(500).json({ error: "Could not update user." });
    }
}