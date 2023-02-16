import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb-adaptor";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/user";
import { compare } from "bcrypt";

export enum LoginError {
    INVALID_CREDENTIALS = 0,
    DATABASE_CONNECTION_FAILED = 1,
    ACCOUNT_DISABLED = 2
}

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const email = credentials?.email || "";
                const password = credentials?.password || "";

                try {
                    await dbConnect();
                } catch (e) {
                    console.log("Error connecting to the database.")
                    throw new Error(JSON.stringify({ errorCode: LoginError.DATABASE_CONNECTION_FAILED }));
                }
                const user = await User.findOne({
                    email
                });

                // Email not found
                if (!user) {
                    throw new Error(JSON.stringify({ errorCode: LoginError.INVALID_CREDENTIALS }));
                }

                if (!user.enabled || (user.devAccount && process.env.NODE_ENV !== "development")) {
                    throw new Error(JSON.stringify({ errorCode: LoginError.ACCOUNT_DISABLED }));
                }

                let passwordCorrect = false;
                if (process.env.NODE_ENV === "development") {
                    // Not secure, only for development.
                    passwordCorrect = password === user.encryptedPassword;
                } else {
                    // Compare the password to an encrypted version
                    passwordCorrect = await compare(password, user.encryptedPassword);
                }

                // Password incorrect
                if (!passwordCorrect) {
                    throw new Error(JSON.stringify({ errorCode: LoginError.INVALID_CREDENTIALS }));
                }

                return user;

            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            console.log(token);
            session.user = {
                name: token.name,
                email: token.email,
                id: token.sub || "unknown",
                roles: token.userRoles,
                maxPower: token.userPower
            }
            console.log(session.user)
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                const rolePowers: number[] = []
                for (const role of user.roles) {
                    rolePowers.push(role.power || 0);
                }
                const maxPower = Math.max(...rolePowers)
                token.userRoles = user.roles
                token.userPower = maxPower
            }
            return token
        },
    },
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/auth/login",
    },
    debug: process.env.NODE_ENV === "development",
})