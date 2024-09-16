import mongoose, { Connection } from "mongoose";

let cachedConnection: Connection | null = null;

export async function connectToMongoDB() {
    if (cachedConnection) {
        console.log("Using Cached DB Connection");
        return cachedConnection;
    }

    try {
        console.log("Establishing DB Connection ...")
        const conn = await mongoose.connect(process.env.MONGODB_URI!);
        cachedConnection = conn.connection;
        console.log("Connection Success!");
        return cachedConnection;
    } catch (error) {
        console.log("Connection Failure:", error);
        throw error;
    }
}
