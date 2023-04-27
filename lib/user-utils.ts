import { User } from "next-auth";

// check if a user has a role
export function userHasRole(roleName: string, user: User): boolean {
    for (const role of user.roles) {
        if (role.name.toLowerCase() === roleName) {
            return true;
        }
    }
    return false;
}

