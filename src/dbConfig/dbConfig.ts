
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
    // Fail fast during import if no URI is configured — helps surface misconfiguration early
    throw new Error("Missing MONGO_URI or MONGODB_URI environment variable");
}

// Use a cached connection across module reloads (Next.js dev mode)
// Declare a typed global cache to avoid `any` and keep TS happy.
declare global {
        var _mongoose: {
        conn: mongoose.Connection | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null } as {
        conn: mongoose.Connection | null;
        promise: Promise<typeof mongoose> | null;
    };
}

async function connectDB(): Promise<mongoose.Connection> {
    // Return existing connection if present
            if (global._mongoose!.conn) {
                return global._mongoose!.conn as mongoose.Connection;
            }

    // Configure mongoose to fail fast instead of buffering operations indefinitely
    mongoose.set("strictQuery", false);
    mongoose.set("bufferCommands", false);

    const opts = {
        // Disable driver command buffering so operations error when not connected
        bufferCommands: false,
        // Fail server selection faster than the long default so we can surface errors quickly
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
    } as mongoose.ConnectOptions;

            if (!global._mongoose!.promise) {
                global._mongoose!.promise = mongoose
                    .connect(MONGO_URI as string, opts)
                    .then((mongooseInstance: typeof mongoose) => {
                        console.log("MongoDB connected");
                        mongooseInstance.connection.on("error", (err: unknown) => console.error("MongoDB connection error:", err));
                        mongooseInstance.connection.on("disconnected", () => console.warn("MongoDB disconnected"));
                        global._mongoose!.conn = mongooseInstance.connection;
                        return mongooseInstance;
                    });
            }

            // Await the promise and return the connection. If connect fails this will throw and
            // callers (API routes) should catch the error and respond accordingly instead of
            // allowing mongoose to buffer queries which later time out.
            const mongooseInstance = await global._mongoose!.promise;
            return mongooseInstance.connection;
}

export default connectDB;