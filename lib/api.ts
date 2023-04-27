import axios from "axios";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";

export const fetcher = async (url: string) => {
    return await axios(url).then((res) => {
        return res.data;
    }).catch((err) => {
        console.error(err);
        throw new Error(`Could not fetch data: ${err}`);
    })
}

export const checkToken = async (req: NextApiRequest, requiredPower: number) => {
    const token = await getToken({ req })

    if (!token) {
        // user is not logged in
        return {
            status: 401,
            message: "You are not logged in."
        }
    } else if (!token.userEnabled) {
        // account is disabled but token valid, so dispose of token
        signOut();
        return {
            status: 403,
            message: "Your account has been disabled."
        }
    } else if ((token.userPower || 0) < requiredPower) {
        // check the user has correct permissions to make the request
        return {
            status: 403,
            message: "You are not authorized to access this endpoint."
        }
    }
}