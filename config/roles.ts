import { Role } from "../types/next-auth";
import { UserPower } from "./user";

export const roles: Role[] = [
    {
        name: "Member",
        colour: "blue",
        power: UserPower.MEMBER
    },
    {
        name: "Manager",
        colour: "green",
        power: UserPower.MANAGER
    },
    {
        name: "Admin",
        colour: "red",
        power: UserPower.ADMIN
    }
]