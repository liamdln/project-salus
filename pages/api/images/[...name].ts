import express, { RequestHandler } from "express"
import { JWT, getToken } from "next-auth/jwt";

// ensure the user is logged in and has the correct permissions
const authVerification: RequestHandler = async function (req, res, next) {
    const jwt = await getToken({ req }) as JWT;
    if (!jwt || jwt === null) {
        // not logged in
        return res.status(401).json({ error: "You must be logged in to view this file." })
    } else if (jwt.userPower < 10 || !jwt.userEnabled) {
        // user is not a member (member power = 10) or their account is disabled
        return res.status(403).json({ error: "Your account is either disabled or you are not a member of this organisation." })
    }
    // pass the request to the next handler
    next();
}

// initialise request
const exp = express();

// initialise the static middleware, pointing to the uploads folder.
const uploadsDir = express.static(process.cwd() + "/uploads");

// bind the auth middleware and static middleware to the "/api/images" route
// so the request's url from next is matched to the express url.
exp.use("/api/images", authVerification, uploadsDir)

// export express with the middleware bound
export default exp;

// tell next that the request is resolved by another framework
// in this case, express
export const config = {
    api: { externalResolver: true }
}