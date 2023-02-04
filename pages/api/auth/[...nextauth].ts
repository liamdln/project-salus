import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb-adaptor";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/user";
import { compare } from "bcrypt";

export enum LoginError {
    INVALID_CREDENTIALS = 0,
    DATABASE_CONNECTION_FAILED = 1
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
                    console.log("NO USER");
                    throw new Error(JSON.stringify({ errorCode: LoginError.INVALID_CREDENTIALS }));
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
                    console.log("NO PASSWORD");
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
                id: token.user["_id"],
                roles: [],
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
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