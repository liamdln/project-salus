import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import dbConnect from "../../../lib/dbConnect";
import { createUser, getUsers } from '../../../lib/users';
import bcrypt from "bcrypt";
import { UserPower } from "../../../config/user";


export default async function handler(req: NextApiRequest, res: NextApiResponse<User | User[] | { status: string, body?: string } | { error: string }>) {

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
            const body = req.body;
            let hashError = false;

            const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS || "10");
            await bcrypt.hash(body.password, saltRounds)
                .then((hash) => {
                    body.encryptedPassword = hash;
                    delete body.password;
                })
                .catch((err) => {
                    console.error(err);
                    hashError = true;
                });

            if (!hashError) {
                return createUser(body)
                    .then(() => res.status(200).json({ status: "success" }))
                    .catch((err) => {
                        console.error(err);
                        return res.status(500).json({ error: "Could not create user." })
                    })
            } else {
                return res.status(500).json({ error: "Could not hash user's password." })
            }
            

        case "GET":
            const users = await getUsers();
            return res.status(200).json(users);

        default:
            return res.status(405).json({ error: `${req.method} request not allowed on this endpoint.` });

    }

}