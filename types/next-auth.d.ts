import NextAuth, { DefaultUser, DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        // TODO: make type for roles
        roles: any[]
    }
    interface Session extends DefaultSession {
        user: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
      user: User
    }
  }