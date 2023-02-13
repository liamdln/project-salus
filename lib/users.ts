import { User as UserType } from "next-auth";
import User from "../model/user"
import dbConnect from "./dbConnect"

export async function getUsers(filter?: Record<string, any>, returnFilter?: string): Promise<UserType[]> {
    await dbConnect();
    return await User.find(filter || {}, returnFilter).then((res: any) => {
        return res;
    }).catch(err => {
        console.log(err);
        throw new Error("Users could not be read.");
    });
}

export async function createUser(user: UserType) {
    await dbConnect();
    const newReport = new User(user);
    try {
        await newReport.save()
    } catch (e) {
        throw new Error(`User could not be saved! Stack:\n${e}`)
    }
}

export async function updateUser(userId: string, update: Record<string, any>) {
    await dbConnect();
    return await User.findByIdAndUpdate(userId, update).then((res: any) => {
        return res;
    }).catch((err) => {
        console.log(err);
        throw new Error("Could not update user.")
    })
}