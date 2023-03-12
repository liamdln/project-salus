import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import dbConnect from "../../../../../lib/dbConnect";
import path from "path";
import fs from "fs/promises"
import { JWT, getToken } from "next-auth/jwt";
import { checkInvalidPermissions } from "../../../../../lib/api";
import { UserPower } from "../../../../../lib/user-utils";

const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, _, res) => {
        console.error(err);
        return res.status(500).json({ error: "Could not upload image." });
    },
    onNoMatch: (req, res) => {
        console.log("tried to call a non delete method here")
        return res.status(405).json({ error: `${req.method} request not allowed on this endpoint.` });
    }
})

// permissions
handler.all(async (req, res, next) => {
    // check if user is logged in and permissions
    const invalidPermissions = await checkInvalidPermissions(req, UserPower.MEMBER)
    if (invalidPermissions) {
        return res.status(invalidPermissions.status).json({ error: invalidPermissions.message })
    }

    // connect to the database
    await dbConnect();

    // once handled, move onto the request (or no match handler)
    next();
})

handler.delete(async (req, res) => {

    const name = req.query.name;
    if (!name) { return res.status(400).json({ error: "Photo name was not present as a query parameter."}) }

    // we know the JWT won't be null as it's checked in "handler.all".
    const jwt = await getToken({ req }) as JWT;

    await fs.unlink(path.join(process.cwd() + "/public", "/restricted", "/uploads", `/${jwt.sub}`, `/${name}`))
        .then(() => {
            return res.status(200).json({ status: "success" })
        })
        .catch((err) => {
        console.error(err);
        return res.status(500).json({error: "Could not delete image."})
    })

})

export default handler;