import type { NextApiRequest, NextApiResponse } from 'next'
import nc from "next-connect";
import dbConnect from "../../../../lib/dbConnect";
import { UserPower } from "../../../../lib/user-utils";
import { checkInvalidPermissions } from "../../../../lib/api";
import formidable from "formidable";
import path from "path";
import moment from "moment";
import fs from "fs/promises"
import { JWT, getToken } from "next-auth/jwt";

const validFileTypes = ["apng", "avif", "gif", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"]

const handler = nc<NextApiRequest, NextApiResponse>({
    onError: (err, _, res) => {
        console.error(err);
        return res.status(500).json({ error: "Could not upload image." });
    },
    onNoMatch: (req, res) => {
        console.log("tried to DELETE")
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

    // ensure the uploads directory is there
    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/restricted", "/uploads", String(jwt.sub || "")));
    } catch (_) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/restricted", "/uploads", String(jwt.sub || "")));
    }

    // save the file
    const form = formidable({
        uploadDir: path.join(process.cwd(), `/public/restricted/uploads/${jwt.sub || "unknown"}`),
        filename: (_, __, part) => {
            return `${moment().format("DD-MM-YYYY-HH-mm-ss")}-${part.originalFilename}`;
        },
        maxFileSize: 10 * 1024 * 1024, // 10MB
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

export default handler;
export const config = {
    api: {
        bodyParser: false,
    },
};