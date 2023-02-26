import NextAuth, { DefaultUser, DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        // TODO: make type for roles
        roles: Role[],
        maxPower: number,
        enabled?: boolean,
        _id?: string
    }
    interface Session extends DefaultSession {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        userRoles: Role[],
        userPower: number
    }
}
  
export type Role = {
    name: string;
    colour: string;
    power: number;
}