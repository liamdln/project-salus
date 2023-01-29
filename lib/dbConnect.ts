// Taken from https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
// Adapted by Liam Pickering

import mongoose, { ConnectOptions } from 'mongoose'

if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

if (!process.env.MONGODB_NAME) {
    throw new Error("Please define the MONGODB_NAME environment variable inside .env.local")
}

const MONGODB_URI: string = process.env.MONGODB_URI;
const MONGODB_NAME: string = process.env.MONGODB_NAME;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts: ConnectOptions = {
            bufferCommands: true,
            dbName: MONGODB_NAME
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect