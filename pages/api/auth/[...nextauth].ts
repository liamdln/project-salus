import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb-adaptor";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../model/user";
import { compare } from "bcrypt";

const incorrectDetailsMessage = "Email or password incorrect."

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
                    throw new Error("Could not connect to the database.");
                }

                const user = await User.findOne({
                    email
                });

                // Email not found
                if (!user) {
                    console.log("NO USER");
                    throw new Error(incorrectDetailsMessage);
                }

                // Compare the password to an encrypted version
                // const passwordCorrect = await compare(password, user.encryptedPassword);

                // Not secure, only for development.
                const passwordCorrect = password === user.encryptedPassword;

                // Password incorrect
                if (!passwordCorrect) {
                    console.log("NO PASSWORD");
                    throw new Error(incorrectDetailsMessage);
                }

                return user;

            }
        })
    ],
    callbacks: {
        async jwt({ token }) {
            token.userName = "admin"
            return token
        }
    },
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/auth/login",
    },
    debug: process.env.NODE_ENV === "development",
})