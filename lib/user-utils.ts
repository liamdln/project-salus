import { User } from "next-auth";

export function userHasRole(roleName: string, user: User): boolean {
    for (const role of user.roles) {
        if (role.name.toLowerCase() === roleName) {
            return true;
        }
    }
    return false;
}

