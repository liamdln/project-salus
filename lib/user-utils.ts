import { User } from "next-auth";

// power of roles.
// if roles are added, be sure to give them a power here.
export enum UserPower {
    MEMBER = 10,
    MANAGER = 50,
    ADMIN = 100
}

export function userHasRole(roleName: string, user: User): boolean {
    for (const role of user.roles) {
        if (role.name.toLowerCase() === roleName) {
            return true;
        }
    }
    return false;
}

