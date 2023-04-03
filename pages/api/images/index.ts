import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import dbConnect from "../../../lib/dbConnect";
import { checkInvalidPermissions } from "../../../lib/api";
import formidable from "formidable";
import path from "path";
import moment from "moment";
import fs from "fs/promises"
import { JWT, getToken } from "next-auth/jwt";
import { UserPower } from "../../../config/user";

const validFileTypes = ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"]

const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, _, res) => {
        console.error(err);
        return res.status(500).json({ error: "Could not upload image." });
    },
    onNoMatch: (req, res) => {
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

handler.post(async (req, res) => {
    // we know the JWT won't be null as it's checked in "handler.all".
    const jwt = await getToken({ req }) as JWT;

    // ensure there is a folder for the user.
    try {
        await fs.readdir(path.join(process.cwd(), "/uploads", String(jwt.sub || "")));
    } catch (_) {
        await fs.mkdir(path.join(process.cwd(), "/uploads", String(jwt.sub || "")), { recursive: true });
    }

    // save the file
    const form = formidable({
        uploadDir: path.join(process.cwd(), `/uploads/${jwt.sub || "unknown"}`),
        filename: (_, __, part) => {
            return `${moment().format("DD-MM-YYYY-HH-mm-ss")}-${part.originalFilename?.replace(" ", "_")}`;
        },
        maxFileSize: 3 * 1024 * 1024, // 3MB
        multiples: false,
        allowEmptyFiles: false
    })

    // check if the file is an image
    form.onPart = (part) => {
        const mimeType = part.mimetype || ""
        if (!mimeType.includes("image") && !validFileTypes.includes(mimeType.split("/").pop() || "")) {
            throw new Error("The file type uploaded was not an image.");
        }
        form._handlePart(part);
    }

    // parse
    form.parse(req, (err, _, files) => {
        if (err) {
            return res.status(err.httpCode || 400).json({ error: String(err) });
        };
        const fileObjectKeys = Object.keys(files);
        return res.status(200).json({ status: "success", payload: files[fileObjectKeys[0]] })
    });

})

handler.delete(async (req, res) => {

    const name = req.query.name;
    if (!name) { return res.status(400).json({ error: "Photo name was not present as a query parameter." }) }

    // we know the JWT won't be null as it's checked in "handler.all".
    const jwt = await getToken({ req }) as JWT;

    await fs.unlink(path.join(process.cwd() + "/uploads", `/${jwt.sub}`, `/${name}`))
        .then(() => {
            return res.status(200).json({ status: "success" })
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ error: "Could not delete image." })
        })

})

export default handler;
export const config = {
    api: {
        bodyParser: false
    },
};