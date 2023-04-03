import express, { RequestHandler } from "express"
import { JWT, getToken } from "next-auth/jwt";

const authVerification: RequestHandler = async function (req, res, next) {
    const jwt = await getToken({ req }) as JWT;
    if (!jwt || jwt === null) {
        return res.status(401).json({ error: "You must be logged in to view this file." })
    } else if (jwt.userPower < 10 || !jwt.userEnabled) {
        // user is not a member (member power = 10) or their account is disabled
        return res.status(403).json({ error: "Your account is either disabled or you are not a member of this organisation." })
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