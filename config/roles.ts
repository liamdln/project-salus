import { Role } from "../types/next-auth";

export const roles: Role[] = [
    {
        name: "Member",
        colour: "blue",
        power: 10
    },
    {
        name: "Manager",
        colour: "green",
        power: 50
    },
    {
        name: "Admin",
        colour: "red",
        power: 100
    }
]