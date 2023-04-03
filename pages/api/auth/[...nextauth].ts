import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb-adaptor";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/user";
import { compare } from "bcrypt";
import { LoginError } from "../../../config/auth";

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
                    console.error("Error connecting to the database.")
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
            session.user = {
                name: token.name,
                email: token.email,
                id: token.sub || "unknown",
                _id: token.sub || "unknown",
                roles: token.userRoles,
                maxPower: token.userPower,
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                console.log("USER: ", user)
                const rolePowers: number[] = []
                for (const role of user.roles) {
                    rolePowers.push(role.power || 0);
                }
                const maxPower = Math.max(...rolePowers)
                token.userRoles = user.roles
                token.userPower = maxPower
                token.userEnabled = user.enabled || false;
            }
            return token
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60 // 30 minutes
    },
    pages: {
        signIn: "/auth/login",
    },
    debug: process.env.NODE_ENV === "development",
})