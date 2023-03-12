import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import dbConnect from "./dbConnect";

export const fetcher = async (url: string) => {
    return await axios(url).then((res) => {
        return res.data;
    }).catch((err) => {
        console.log(err);
        throw new Error(`Could not fetch data: ${err}`);
    })
}

export const checkInvalidPermissions = async (req: NextApiRequest, requiredPower: number) => {
    // check user is logged in
    const token = await getToken({ req })
    if (!token) {
        return {
            status: 401,
            message: "You are not logged in."
        }
    }

    // check permissions
    if ((token.userPower || 0) < requiredPower) {
        return {
            status: 403,
            message: "You are not authorized to access this endpoint."
        }
    }
}