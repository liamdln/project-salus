import express, { RequestHandler } from "express"
import { JWT, getToken } from "next-auth/jwt";

const authVerification: RequestHandler = async function (req, res, next) {
    const jwt = await getToken({ req }) as JWT;
    if (!jwt || jwt === null) {
        res.status(401).json({ error: "You must be logged in to view this file." })
    }
    next();
}

const exp = express();
const uploadsDir = express.static(process.cwd() + "/uploads");
exp.use("/api/images", authVerification, uploadsDir)


export default exp;
export const config = {
    api: { externalResolver: true }
}